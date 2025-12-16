'use client';

import { TextField, TextFieldProps, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

type FormFieldProps = TextFieldProps & {
    type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select';
    options?: { value: string; label: string }[];
    dateValue?: Date | null;
    onDateChange?: (date: Date | null) => void;
};

export default function FormField({
    type = 'text',
    options,
    dateValue,
    onDateChange,
    ...props
}: FormFieldProps) {
    if (type === 'date') {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={props.label}
                    value={dateValue}
                    onChange={onDateChange}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            required: props.required,
                            error: props.error,
                            helperText: props.helperText,
                            size: props.size || 'medium',
                        },
                    }}
                />
            </LocalizationProvider>
        );
    }

    if (type === 'select') {
        return (
            <TextField select fullWidth {...props}>
                {options?.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        );
    }

    return <TextField type={type} fullWidth {...props} />;
}
