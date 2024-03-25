import { Demo } from '@/types';

export const DataWargaService = {
    getDataWarga() {
        return fetch('https://localhost:44313/idcen/DataWarga/getList')
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    }
};