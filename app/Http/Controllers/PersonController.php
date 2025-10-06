<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use Illuminate\Support\Facades\Storage;

class PersonController extends Controller
{
    // ambil data untuk tabel
    public function index()
    {
        $people = Person::all();
        return response()->json($people);
        // return response()->json(Person::all());
    }

    // simpan data baru
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:50',
            'tgl_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'image' => 'nullable|image|max:200',
            'files.*' => 'nullable|mimes:pdf,doc,docx,jpg,png|max:200'
        ]);

        // Upload image (jika ada)
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }

        // Upload multiple files
        $filesPath = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filesPath[] = $file->store('files', 'public');
            }
        }

        // Simpan data
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

    
    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);
        
        $request->validate([
            'nama' => 'required|max:50',
            'tgl_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'files.*' => 'nullable|mimes:pdf,doc,docx,jpg,png|max:2048'
        ]);
        
        // Upload image baru
        $imagePath = $person->image;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
        }
        
        // Upload multiple files baru
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
    
    public function show($id)
    {
        $person = Person::findOrFail($id);
        return response()->json($person);
    }
    
    public function destroy($id)
    {
        $person = Person::findOrFail($id);
        $person->delete();
        return response()->json(['success' => true]);
    }


}
