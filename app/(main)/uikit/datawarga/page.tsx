'use client';
//import { CustomerService } from '../../../../demo/service/CustomerService';
//import { ProductService } from '../../../../demo/service/ProductService';
import { DataWargaService } from '../../../../demo/service/DataWargaService';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
//import { Calendar } from 'primereact/calendar';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
//import { Dropdown } from 'primereact/dropdown';
//import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
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

const TableDemo = () => {
    const [dataWarga1, setDataWarga1] = useState<Demo.Customer[]>([]);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

    // custom by heru
    const [displayBasic, setDisplayBasic] = useState(false);
    const [checkboxValue, setCheckboxValue] = useState<string[]>([]);

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
                <Button outlined type="button" label="Tambah" icon="pi pi-plus-circle" onClick={() => setDisplayBasic(true)} />
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

    const getDataWarga = (data: Demo.Customer[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
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

//    const basicDialogFooter = <Button type="button" label="Save" onClick={() => {setDisplayBasic(false); saveProduct(); }} icon="pi pi-check" outlined />;
    const basicDialogFooter = <Button type="button" label="Save" onClick={() => saveProduct()} icon="pi pi-check" outlined />;

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    const header1 = renderHeader1();

    return (
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
                        <Column field="dw_insert_date" header="Insert Date" sortable style={{ minWidth: '12rem' }} />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 lg:col-6">
                <Dialog header="Dialog" visible={displayBasic} style={{ width: '40vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor="dw_nama_lengkap">Nama Lengkap</label>
                            <InputText id="dw_nama_lengkap" type="text" required />
                        </div>
                        <div className="field">
                            <label htmlFor="dw_no_kk">No KK</label>
                            <InputText id="dw_no_kk" type="text" />
                        </div>
                        <div className="field">
                            <label htmlFor="dw_nik">NIK</label>
                            <InputText id="dw_nik" type="text" />
                        </div>
                        <div className="field">
                            <label htmlFor="dw_jenis_kelamin">Jenis Kelamin</label>
                            <InputText id="dw_jenis_kelamin" type="text" />
                        </div>
                        <div className="field">
                            <label htmlFor="dw_alamat">Alamat</label>
                            <InputTextarea id="dw_alamat" rows={4} />
                        </div>
                        <div className="field">
                            <label htmlFor="dw_no_hp">No HP</label>
                            <InputText id="dw_no_hp" type="text" />
                        </div>
                        <div className="field-checkbox">
                            <Checkbox
                                inputId="checkOption1"
                                name="option"
                                value="Active"
                                checked={
                                    checkboxValue.indexOf("Active") !== -1
                                }
                                onChange={onCheckboxChange}
                            />
                            <label htmlFor="checkOption1">Active</label>
                        </div>
                        </div>
                </Dialog>
            </div>
        </div>
    );
};

export default TableDemo;
