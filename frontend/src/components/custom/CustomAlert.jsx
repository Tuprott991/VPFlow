// components/CustomAlert.jsx
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomAlert = ({ open, severity = 'info', message, onClose }) => {
    return (
        <Collapse in={open}>
            <Alert
                severity={severity}
                action={
                    <IconButton color="inherit" size="small" onClick={onClose}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2, borderRadius: 2 }}
            >
                {message}
            </Alert>
        </Collapse>
    );
};

export default CustomAlert;
