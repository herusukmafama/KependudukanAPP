'use client';
import { DataWargaService } from '../../../../demo/service/DataWargaService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
//import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
//import { Dropdown } from 'primereact/dropdown';
//import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
//import { MultiSelect } from 'primereact/multiselect';
//import { ProgressBar } from 'primereact/progressbar';
//import { Rating } from 'primereact/rating';
//import { Slider } from 'primereact/slider';
//import { ToggleButton } from 'primereact/togglebutton';
//import { TriStateCheckbox } from 'primereact/tristatecheckbox';
//import { classNames } from 'primereact/utils';
import React, { useEffect, useState, useRef } from 'react';
import type { Demo } from '@/types';

// custom by heru

import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
//import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
//import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Menu } from 'primereact/menu';


const TableDemo = () => {

    let emptyWarga: any = {
        dw_no_kk: '',
        dw_nik: '',
        dw_nama_lengkap: '',
        dw_jenis_kelamin: '',
        dw_alamat: '',
        dw_no_hp: '',
        dw_ktp: false,
        dw_user_submit: ''
    };

    const [dataWarga1, setDataWarga1] = useState<Demo.Customer[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

    // custom by heru

    const [displayBasic, setDisplayBasic] = useState(false);
    const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
    const [warga, setWarga] = useState(emptyWarga);
    const toast = useRef<Toast>(null);
    const menuLeft = useRef<Menu>(null);

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Refresh',
                    icon: 'pi pi-refresh',
                    command: () => {
                        actionDelete(rowData: Demo.Customer)
                    }
                },
                {
                    label: 'Export',
                    icon: 'pi pi-upload'
                }
            ]
        }
    ];

    const actionDelete = (data) => {

    }

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    const renderHeader1 = () => {
        return (
            <div className="flex justify-content-between">
                <Button outlined type="button" label="Tambah" icon="pi pi-plus-circle" onClick={() => {setDisplayBasic(true); setWarga(emptyWarga);} } />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);

        DataWargaService.getDataWarga().then((data) => {
            setDataWarga1(getDataWarga(data));
            setLoading1(false);
        });

        initFilters1();
    }, []);

    const getDataWarga = (data: void | Demo.Customer[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue1('');
    };

    const basicDialogFooter = <Button type="button" label="Save" onClick={() => saveWarga()} icon="pi pi-check" outlined />;
    
    // onChange untuk mendapatkan value dari form,
    // kemudian akan dijadikan object untuk di request ke service API
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _warga = { ...warga };

        _warga[`${name}`] = val;
        setWarga(_warga);
    };

    const onCategoryChange = (e: { value: any; }) => {
        let _warga = { ...warga };

        _warga['dw_jenis_kelamin'] = e.value;
        setWarga(_warga);
    };

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        debugger
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);

        let _warga = { ...warga };

        _warga['dw_ktp'] = e.checked;
        _warga['dw_user_submit'] = 'admin'; // hardcore
        setWarga(_warga);
    };

    const saveWarga = async () => {

        // data to be sent to the POST request
        let _data = { ...warga };
        console.log({_data});

        try {
            const rawResponse = await fetch('https://localhost:44313/idcen/DataWarga/insert', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            });
            const content = await rawResponse.json();

            if(content.status === "Success"){
                toast.current?.show({ severity: 'success', summary: content.status, detail: 'Data Warga has been Saved', life: 6000 });
                
                // close modal
                setDisplayBasic(false);
                setWarga(emptyWarga);

                // reload data after save
                DataWargaService.getDataWarga().then((data) => {
                    setDataWarga1(getDataWarga(data));
                    setLoading1(false);
                });
            }else{
                toast.current?.show({ severity: 'error', summary: content.status, detail: content.message, life: 6000 });
            }
        } catch(error) {
            console.error('Fetch', error);
            toast.current?.show({ severity: 'error', summary: 'error', detail: 'Failed to fetch', life: 6000 });
              // Output e.g.: "Fetch Error: 404, Not found"
        }
    };

    const verifiedBodyTemplate = (rowData: Demo.Customer) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': rowData.dw_ktp,
                    'text-pink-500 pi-times-circle': !rowData.dw_ktp
                })}
            ></i>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.dw_insert_date);
    };

    const btnAction = () => {
        return (
            <div className="card flex justify-content-center">
                <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
                <Button label="Show Left" icon="pi pi-align-left" className="mr-2" onClick={(event) => menuLeft.current?.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />
            </div>
        )
    }

    const formatDate = (value: Date) => {
        return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    };

    const header1 = renderHeader1();

    return (
        <div>
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>Data Warga</h5>
                        <DataTable
                            value={dataWarga1}
                            paginator
                            className="p-datatable-gridlines"
                            showGridlines
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            dataKey="dw_id"
                            filters={filters1}
                            filterDisplay="menu"
                            loading={loading1}
                            responsiveLayout="scroll"
                            emptyMessage="No data found."
                            header={header1}
                        >
                            <Column field="dw_no_kk" header="No KK" sortable style={{ minWidth: '12rem' }} />
                            <Column field="dw_nik" header="NIK" sortable style={{ minWidth: '12rem' }} />
                            <Column field="dw_nama_lengkap" header="Nama Lengkap" sortable style={{ minWidth: '12rem' }} />
                            <Column field="dw_jenis_kelamin" header="Jenis Kelamin" sortable style={{ minWidth: '8rem' }} />
                            <Column field="dw_alamat" header="Alamat" sortable style={{ minWidth: '12rem' }} />
                            <Column field="dw_no_hp" header="No HP" sortable style={{ minWidth: '12rem' }} />
                            <Column field="dw_ktp" header="Status" sortable dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} />
                            <Column field="dw_insert_date" header="Insert Date" body={dateBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                            <Column field='dw_id' body={btnAction} header="Action" sortable style={{ minWidth: '12rem' }} />
                        </DataTable>
                    </div>
                </div>

                <div className="col-12 lg:col-6">
                    <Dialog header="" visible={displayBasic} style={{ width: '40vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                        <div className="card p-fluid">
                            <div className="field">
                                <label htmlFor="dw_no_kk">No KK</label>
                                <InputText id="dw_no_kk" type="text" onChange={(e) => onInputChange(e, 'dw_no_kk')} className="" autoFocus />
                            </div>
                            <div className="field">
                                <label htmlFor="dw_nik">NIK</label>
                                <InputText id="dw_nik" type="text" onChange={(e) => onInputChange(e, 'dw_nik')} className="" />
                            </div>
                            <div className="field" style={{marginBottom: '15px'}}>
                                <label htmlFor="dw_nama_lengkap">Nama Lengkap</label>
                                <InputText id="dw_nama_lengkap" value={warga.dw_nama_lengkap} onChange={(e) => onInputChange(e, 'dw_nama_lengkap')} className="" />
                            </div>
                            <div className="field">
                                <label htmlFor="dw_jenis_kelamin">Jenis Kelamin</label>
                                <div className="formgrid grid">
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="category1" name="dw_jenis_kelamin" value="L" onChange={onCategoryChange} checked={warga.dw_jenis_kelamin === 'L'} />
                                        <label htmlFor="category1">Laki-Laki</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="category2" name="dw_jenis_kelamin" value="P" onChange={onCategoryChange} checked={warga.dw_jenis_kelamin === 'P'} />
                                        <label htmlFor="category2">Perempuan</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="dw_alamat">Alamat</label>
                                <InputTextarea id="dw_alamat" rows={4} onChange={(e) => onInputChange(e, 'dw_alamat')} className="" />
                            </div>
                            <div className="field">
                                <label htmlFor="dw_no_hp">No HP</label>
                                <InputText id="dw_no_hp" type="text" onChange={(e) => onInputChange(e, 'dw_no_hp')} className="" />
                            </div>
                            <div className="field" hidden>
                                <label htmlFor="dw_user_submit">User Submit</label>
                                <InputText id="dw_user_submit" type="text" onChange={(e) => onInputChange(e, 'dw_user_submit')} className="" defaultValue={"admin"} readOnly />
                            </div>
                            <div className='field'>
                                <label htmlFor=''></label>
                                    <div className="field-checkbox">
                                        <Checkbox
                                            inputId="checkOption1"
                                            name="option"
                                            value='true'
                                            checked={
                                                checkboxValue.indexOf("true") !== -1
                                            }
                                            onChange={onCheckboxChange}
                                        />
                                        <label htmlFor="checkOption1">Active</label>
                                    </div>
                            </div>
                            </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TableDemo;
