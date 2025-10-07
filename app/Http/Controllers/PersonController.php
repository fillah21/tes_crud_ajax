<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Person::all()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:50',
            'tgl_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'image' => 'nullable|image|max:1024',
            'files.*' => 'nullable|mimes:pdf,doc,docx,jpg,png|max:1024',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        $filesPath = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filesPath[] = $file->store('files', 'public');
            }
        }

        $person = Person::create([
            'nama' => $request->nama,
            'tgl_lahir' => $request->tgl_lahir,
            'agama' => $request->agama,
            'provinsi' => $request->provinsi,
            'kabupaten' => $request->kabupaten,
            'desa' => $request->desa,
            'hobi' => $request->hobi ? implode(',', $request->hobi) : null,
            'status' => $request->status,
            'image' => $imagePath,
            'files' => json_encode($filesPath),
        ]);

        return response()->json(['success' => true, 'data' => $person]);
    }

    public function edit($id)
    {
        $person = Person::findOrFail($id);
        return response()->json(['data' => $person]);
    }

    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);

        $request->validate([
            'nama' => 'required|max:50',
            'tgl_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'image' => 'nullable|image|max:1024',
            'files.*' => 'nullable|mimes:pdf,doc,docx,jpg,png|max:1024',
        ]);

        $imagePath = $person->image;
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('images', 'public');
        }

        $filesPath = $person->files ? json_decode($person->files, true) : [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filesPath[] = $file->store('files', 'public');
            }
        }

        $person->update([
            'nama' => $request->nama,
            'tgl_lahir' => $request->tgl_lahir,
            'agama' => $request->agama,
            'provinsi' => $request->provinsi,
            'kabupaten' => $request->kabupaten,
            'desa' => $request->desa,
            'hobi' => $request->hobi ? implode(',', $request->hobi) : null,
            'status' => $request->status,
            'image' => $imagePath,
            'files' => json_encode($filesPath),
        ]);

        return response()->json(['success' => true, 'data' => $person]);
    }

    public function destroy($id)
    {
        $person = Person::findOrFail($id);
        if ($person->image && Storage::disk('public')->exists($person->image)) {
            Storage::disk('public')->delete($person->image);
        }
        $person->delete();

        return response()->json(['success' => true]);
    }
}
