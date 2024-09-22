import { StylesConfig } from 'react-select';

export const customStyles = (theme: string) => ({
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: "transparent",
        border: state.isFocused ? "1px solid #2563EB" : theme === "dark" ? "0px solid #E2E8F0" : "1px solid #E2E8F0",
        borderRadius: "0.75rem",
        boxShadow: "none",
        minHeight: "2.5rem",
        width: "100%",
        "&:hover": {
            border: state.isFocused ? "1px solid #2563EB" : theme === "dark" ? "0px solid #E2E8F0" : "1px solid #E2E8F0",
        },
        color: theme === "dark" ? "#FFFFFF" : "#000000",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: theme === "dark" ? "#FFFFFF" : "#A0AEC0",
        fontSize: "0.875rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "2px"
    }),
    input: (provided: any) => ({
        ...provided,
        color: theme === "dark" ? "#FFFFFF" : "#000000",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        backgroundColor: "transparent",
        color: theme === "dark" ? "#FFFFFF" : "#000000",
        marginTop: "2px",
        marginLeft: "-2.5px"
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: theme === "dark" ? "#3A3B3C" : "#FFFFFF",
        borderRadius: "0.75rem",
    }),
    menuList: (provided: any) => ({
        ...provided,
        backgroundColor: "transparent",
        color: theme === "dark" ? "#FFFFFF" : "#3A3B3C",
        maxHeight: "150px",
        borderRadius: "0.75rem",
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: any) => ({
        ...styles,
        backgroundColor: isSelected
            ? theme === "dark" ? '#242526' : "#E2E8F0"
            : isFocused
                ? theme === "dark" ? '#27282a' : "#d1d5db"
                : "transparent",
        color: isDisabled
            ? theme === "dark" ? '#718096' : '#A0AEC0'
            : theme === "dark" ? '#FFFFFF' : '#3A3B3C',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    }),
    container: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem",
        width: "100%",
    }),
});
