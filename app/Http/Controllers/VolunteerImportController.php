<?php

namespace App\Http\Controllers;

use App\Http\Requests\VolunteerImportRequest;
use App\Models\Volunteer;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VolunteerImportController extends Controller
{
    private const EXPECTED_COLUMNS = ['name', 'father_name', 'phone', 'cnic', 'status', 'joined_date'];

    private const MAX_ROWS = 2000;

    public function create(): Response
    {
        return Inertia::render('volunteers/import');
    }

    public function store(VolunteerImportRequest $request): Response
    {
        $handle = fopen($request->file('file')->getRealPath(), 'r');

        $header = $this->readHeader($handle);
        $missingColumns = array_diff(self::EXPECTED_COLUMNS, $header);

        if (! empty($missingColumns)) {
            fclose($handle);

            return back()->withErrors(['file' => 'The CSV is missing required column(s): '.implode(', ', $missingColumns).'.']);
        }

        $imported = 0;
        $skipped = [];
        $seenPhones = [];
        $seenCnics = [];
        $rowNumber = 1;
        $dataRows = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;

            if (count(array_filter($row, fn ($value) => trim((string) $value) !== '')) === 0) {
                continue;
            }

            $dataRows++;

            if ($dataRows > self::MAX_ROWS) {
                $skipped[] = ['row' => $rowNumber, 'reason' => 'Import limit of '.self::MAX_ROWS.' rows exceeded; remaining rows were not processed.'];

                break;
            }

            $data = $this->normalizeRow($header, $row);

            $validator = Validator::make($data, [
                'name' => ['required', 'string', 'max:255'],
                'father_name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'regex:/^\d{4}-\d{7}$/'],
                'cnic' => ['nullable', 'regex:/^\d{5}-\d{7}-\d{1}$/'],
                'status' => ['required', 'in:active,inactive'],
                'joined_date' => ['required', 'date'],
            ]);

            if ($validator->fails()) {
                $skipped[] = ['row' => $rowNumber, 'reason' => $validator->errors()->first()];

                continue;
            }

            $phone = $data['phone'];
            $cnic = $data['cnic'];

            if (isset($seenPhones[$phone]) || Volunteer::where('phone', $phone)->exists()) {
                $skipped[] = ['row' => $rowNumber, 'reason' => "Phone {$phone} already exists."];

                continue;
            }

            if ($cnic && (isset($seenCnics[$cnic]) || Volunteer::where('cnic', $cnic)->exists())) {
                $skipped[] = ['row' => $rowNumber, 'reason' => "CNIC {$cnic} already exists."];

                continue;
            }

            Volunteer::create([
                'name' => $data['name'],
                'father_name' => $data['father_name'],
                'phone' => $phone,
                'cnic' => $cnic,
                'status' => $data['status'],
                'joined_date' => $data['joined_date'],
            ]);

            $seenPhones[$phone] = true;

            if ($cnic) {
                $seenCnics[$cnic] = true;
            }

            $imported++;
        }

        fclose($handle);

        return Inertia::render('volunteers/import', [
            'results' => [
                'total' => $dataRows,
                'imported' => $imported,
                'skipped' => $skipped,
            ],
        ]);
    }

    public function template(): StreamedResponse
    {
        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, self::EXPECTED_COLUMNS);
            fputcsv($handle, ['Ali Raza', 'Muhammad Raza', '0300-1234567', '42101-1234567-1', 'active', now()->format('Y-m-d')]);
            fclose($handle);
        }, 'volunteers-import-template.csv', ['Content-Type' => 'text/csv']);
    }

    /**
     * @return string[]
     */
    private function readHeader($handle): array
    {
        $header = fgetcsv($handle) ?: [];

        if (isset($header[0])) {
            $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]);
        }

        return array_map(fn ($column) => strtolower(trim((string) $column)), $header);
    }

    /**
     * @param  string[]  $header
     * @param  array<int, string|null>  $row
     * @return array<string, string|null>
     */
    private function normalizeRow(array $header, array $row): array
    {
        $row = array_slice(array_pad($row, count($header), null), 0, count($header));
        $data = array_combine($header, array_map(fn ($value) => $value === null ? null : trim((string) $value), $row));

        $data['cnic'] = ($data['cnic'] ?? '') !== '' ? $data['cnic'] : null;

        return $data;
    }
}
