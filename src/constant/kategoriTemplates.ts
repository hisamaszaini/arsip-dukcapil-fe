export const kategoriTemplates = [
    {
        id: 'akta_kelahiran',
        label: 'Akta Kelahiran (Format Baru)',
        data: {
            name: 'Akta Kelahiran',
            formNo: 'No. Akta',
            noType: 'CUSTOM',
            noPrefix: '',
            noMinLength: 18,
            noMaxLength: 25,
            noFormat: '3502-LU-12032024-0001',
            noMask: '0000-AA-00000000-0000',
            noRegex: '^[0-9]{4}-(LU|LT)-[0-9]{8}-[0-9]{4}$',
            description: 'Arsip Akta Kelahiran (Kode: LU/LT)'
        }
    },
    {
        id: 'akta_kematian',
        label: 'Akta Kematian',
        data: {
            name: 'Akta Kematian',
            formNo: 'No. Akta',
            noType: 'CUSTOM',
            noPrefix: '',
            noMinLength: 18,
            noMaxLength: 25,
            noFormat: '3502-KM-12032024-0001',
            noMask: '0000-AA-00000000-0000',
            noRegex: '^[0-9]{4}-KM-[0-9]{8}-[0-9]{4}$',
            description: 'Arsip Akta Kematian (Kode: KM)'
        }
    },
    {
        id: 'kk',
        label: 'Kartu Keluarga (KK)',
        data: {
            name: 'Kartu Keluarga',
            formNo: 'No. KK',
            noType: 'NUMERIC',
            noPrefix: '',
            noMinLength: 16,
            noMaxLength: 16,
            noFormat: '3502012301100001',
            noMask: '0000000000000000',
            noRegex: '^[0-9]{16}$',
            description: 'Arsip Kartu Keluarga (16 digit NIK Kepala Keluarga/Nomor KK)'
        }
    },
    {
        id: 'ktp',
        label: 'KTP / NIK',
        data: {
            name: 'KTP',
            formNo: 'NIK',
            noType: 'NUMERIC',
            noPrefix: '',
            noMinLength: 16,
            noMaxLength: 16,
            noFormat: '3502012301100001',
            noMask: '0000000000000000',
            noRegex: '^[0-9]{16}$',
            description: 'Arsip KTP Perorangan'
        }
    }
];
