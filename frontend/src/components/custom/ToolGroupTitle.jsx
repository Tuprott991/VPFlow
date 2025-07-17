import { Typography } from '@mui/material';

const ToolGroupTitle = ({ title }) => {
    return (
        <Typography fontWeight={500} mb={1} sx={{ fontSize: '12px', color: '#737476' }}>
            {title}
        </Typography>
    );
}

export default ToolGroupTitle;