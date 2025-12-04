import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createKategoriSchema, type CreateKategoriDto, type Kategori } from '../../types/kategori.types';
import { Button } from '../ui/Button';
import SelectInput from '../ui/SelectInput';
import TextInput from '../ui/TextInput';
import { kategoriTemplates } from '../../constant/kategoriTemplates';

interface KategoriFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateKategoriDto, id: number | null) => void;
    editingData: Kategori | null;
}

const KategoriFormModal: React.FC<KategoriFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingData
}) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
        setValue
    } = useForm<CreateKategoriDto>({
        resolver: zodResolver(createKategoriSchema) as any,
        defaultValues: {
            name: '',
            description: '',
            maxFile: 1,
            formNo: '',
            rulesFormNama: false,
            noType: 'ALPHANUMERIC',
            noMinLength: undefined,
            noMaxLength: undefined,
            noRegex: '',
            noPrefix: '',
            noFormat: '',
            noMask: '',
            uniqueConstraint: 'NONE',
            isEncrypt: false,
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editingData) {
                setValue('name', editingData.name);
                setValue('description', editingData.description || '');
                setValue('maxFile', editingData.maxFile);
                setValue('formNo', editingData.formNo);
                setValue('rulesFormNama', editingData.rulesFormNama);
                setValue('rulesFormTanggal', editingData.rulesFormTanggal);

                // New fields
                setValue('noType', editingData.noType || 'ALPHANUMERIC');
                setValue('noMinLength', editingData.noMinLength || undefined);
                setValue('noMaxLength', editingData.noMaxLength || undefined);
                setValue('noRegex', editingData.noRegex || '');
                setValue('noPrefix', editingData.noPrefix || '');
                setValue('noFormat', editingData.noFormat || '');
                setValue('noMask', editingData.noMask || '');

                setValue('uniqueConstraint', editingData.uniqueConstraint || 'NONE');
                setValue('isEncrypt', editingData.isEncrypt || false);
            } else {
                reset({
                    name: '',
                    description: '',
                    maxFile: 1,
                    formNo: '',
                    rulesFormNama: false,
                    rulesFormTanggal: false,
                    noType: 'ALPHANUMERIC',
                    noMinLength: undefined,
                    noMaxLength: undefined,
                    noRegex: '',
                    noPrefix: '',
                    noFormat: '',
                    noMask: '',
                    uniqueConstraint: 'NONE',
                    isEncrypt: false,
                });
            }
        }
    }, [isOpen, editingData, setValue, reset]);

    const onSubmit = (data: CreateKategoriDto) => {
        onSave(data, editingData ? editingData.id : null);
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const template = kategoriTemplates.find(t => t.id === templateId);

        if (template) {
            const t = template.data;
            setValue('name', t.name);
            setValue('description', t.description);
            setValue('formNo', t.formNo);
            setValue('noType', t.noType as any);
            setValue('noPrefix', t.noPrefix);
            setValue('noMinLength', t.noMinLength);
            setValue('noMaxLength', t.noMaxLength);
            setValue('noFormat', t.noFormat);
            setValue('noMask', t.noMask);
            setValue('noRegex', t.noRegex);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-none">
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingData ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Template Selection */}
                        {!editingData && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                <SelectInput
                                    id="template"
                                    label="Pilih Template (Opsional)"
                                    onChange={handleTemplateChange}
                                    className="bg-white"
                                >
                                    <option value="">-- Pilih Template Kategori --</option>
                                    {kategoriTemplates.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </SelectInput>
                                <p className="text-xs text-blue-600 mt-2">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Memilih template akan mengisi otomatis form di bawah ini.
                                </p>
                            </div>
                        )}

                        {/* Nama Kategori */}
                        <TextInput
                            id="name"
                            label="Nama Kategori"
                            placeholder="Contoh: Akta Kelahiran"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-4 py-3 border border-blue-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                                placeholder="Deskripsi singkat kategori..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Max File */}
                            <TextInput
                                id="maxFile"
                                type="number"
                                label="Maksimal File"
                                min={1}
                                error={errors.maxFile?.message}
                                {...register('maxFile', { valueAsNumber: true })}
                            />

                            {/* Label No. Form */}
                            <TextInput
                                id="formNo"
                                label="Label No. Form"
                                placeholder="Contoh: NIK, No. Akta"
                                error={errors.formNo?.message}
                                {...register('formNo')}
                            />
                        </div>

                        {/* Dynamic Validation Rules Section */}
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Aturan Validasi Nomor</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Tipe Validasi */}
                                <Controller
                                    name="noType"
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <SelectInput
                                            id="noType"
                                            label="Tipe Input"
                                            value={value || 'ALPHANUMERIC'}
                                            onChange={onChange}
                                            error={error?.message}
                                        >
                                            <option value="ALPHANUMERIC">Huruf & Angka</option>
                                            <option value="NUMERIC">Angka Saja</option>
                                            <option value="CUSTOM">Custom (Regex)</option>
                                        </SelectInput>
                                    )}
                                />

                                {/* Prefix */}
                                <TextInput
                                    id="noPrefix"
                                    label="Prefix Otomatis"
                                    placeholder="Contoh: 3502-"
                                    {...register('noPrefix')}
                                />

                                {/* Min Length */}
                                <TextInput
                                    id="noMinLength"
                                    type="number"
                                    label="Min Karakter"
                                    {...register('noMinLength', { valueAsNumber: true })}
                                />

                                {/* Max Length */}
                                <TextInput
                                    id="noMaxLength"
                                    type="number"
                                    label="Max Karakter"
                                    {...register('noMaxLength', { valueAsNumber: true })}
                                />

                                {/* Format Contoh */}
                                <TextInput
                                    id="noFormat"
                                    label="Contoh Format"
                                    placeholder="Placeholder input"
                                    {...register('noFormat')}
                                />

                                {/* Input Mask */}
                                <TextInput
                                    id="noMask"
                                    label="Input Mask"
                                    placeholder="####-AA-####"
                                    helpText="#=Angka, A=Huruf, *=Semua"
                                    {...register('noMask')}
                                />

                                {/* Regex (Full Width) */}
                                <div className="col-span-3">
                                    <TextInput
                                        id="noRegex"
                                        label="Regex Pattern (Advanced)"
                                        placeholder="Contoh: ^[0-9]{4}-[A-Z]{2}-.*"
                                        className="font-mono text-sm"
                                        {...register('noRegex')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rules - Menggunakan SelectInput */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                            <Controller
                                name="rulesFormNama"
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <SelectInput
                                        id="rulesFormNama"
                                        label="Wajib isi Nama?"
                                        value={value ? "true" : "false"}
                                        onChange={(e) => onChange(e.target.value === "true")}
                                        error={error?.message}
                                    >
                                        <option value="true">Wajib</option>
                                        <option value="false">Tidak</option>
                                    </SelectInput>
                                )}
                            />

                            <Controller
                                name="rulesFormTanggal"
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <SelectInput
                                        id="rulesFormTanggal"
                                        label="Wajib isi Tanggal?"
                                        value={value ? "true" : "false"}
                                        onChange={(e) => onChange(e.target.value === "true")}
                                        error={error?.message}
                                    >
                                        <option value="true">Wajib</option>
                                        <option value="false">Tidak</option>
                                    </SelectInput>
                                )}
                            />
                        </div>

                        {/* Unique Constraint */}
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Aturan Keunikan</h4>
                            <Controller
                                name="uniqueConstraint"
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <SelectInput
                                        id="uniqueConstraint"
                                        label="Cek Duplikasi Data?"
                                        value={value || 'NONE'}
                                        onChange={onChange}
                                        error={error?.message}
                                    >
                                        <option value="NONE">Tidak Ada (Boleh Duplikat)</option>
                                        <option value="NO">Nomor Harus Unik</option>
                                        <option value="NO_TANGGAL">Nomor + Tanggal Harus Unik</option>
                                        <option value="NO_NOFISIK">Nomor + No Fisik Harus Unik</option>
                                    </SelectInput>
                                )}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                <i className="fas fa-info-circle mr-1"></i>
                                Menentukan kombinasi kolom yang harus unik dalam kategori ini.
                            </p>
                        </div>

                        {/* Encryption Setting */}
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Keamanan File</h4>
                            <Controller
                                name="isEncrypt"
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <SelectInput
                                        id="isEncrypt"
                                        label="Enkripsi File JPG?"
                                        value={value ? "true" : "false"}
                                        onChange={(e) => onChange(e.target.value === "true")}
                                        error={error?.message}
                                    >
                                        <option value="false">Tidak (Simpan Biasa)</option>
                                        <option value="true">Ya (Enkripsi AES-256)</option>
                                    </SelectInput>
                                )}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                <i className="fas fa-lock mr-1"></i>
                                Jika aktif, file JPG akan dienkripsi di server dan hanya bisa dibuka melalui aplikasi ini.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                                Batal
                            </Button>
                            <Button type="submit" variant="primary" isLoading={isSubmitting}>
                                {editingData ? 'Simpan Perubahan' : 'Buat Kategori'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KategoriFormModal;
