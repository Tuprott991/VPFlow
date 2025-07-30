import { Typography } from '@mui/material';

const ToolGroupTitle = ({ title }) => {
    return (
        <Typography fontWeight={500} mb={1} sx={{ fontSize: '16px', color: '#e7531eff', }}>
            {title}
        </Typography>
    );
}




export default ToolGroupTitle;