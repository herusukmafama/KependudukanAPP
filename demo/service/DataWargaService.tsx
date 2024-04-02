import { Demo } from '@/types';

export const DataWargaService = {
    getDataWarga() {
        const url = "https://localhost:44313/idcen/DataWarga/getList";
        // fetch with error handling
        return fetch(url).then((response) => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Something went wrong');
              })
              .then((responseJson) => {
                // Do something with the response
                return responseJson.data as Demo.Customer[]
              })
              .catch((error) => {
                console.log(error);
              });
    }
};