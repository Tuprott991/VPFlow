import { Button, Box } from '@mui/material';

const ToolButton = ({ props }) => {
    return (
        <Button
            fullWidth
            onClick={() => console.log('Import file clicked')}
            sx={{
                backgroundColor: '#FBFBFB',
                fontSize: 12,
                py: 1,
                borderRadius: '10px',
                border: '1px solid #EEEFF1',
                mb: 1,
                justifyContent: 'flex-start',
                px: 0.9
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #EEEFF1',
                        borderRadius: '5px',
                        p: '2px',
                    }}
                >
                    {props.icon}
                </Box>
                <Box component="span" sx={{ textAlign: 'left', color: '#303135' }}>
                    {props.text}
                </Box>
            </Box>
        </Button>
    )
};

export default ToolButton;