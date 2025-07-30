// import { Button, Box } from '@mui/material';

// const ToolButton = ({ props }) => {
//     return (
//         <Button
//             fullWidth
//             onClick={() => console.log('Import file clicked')}
//             sx={{
//                 backgroundColor: '#FBFBFB',
//                 fontSize: 12,
//                 py: 1,
//                 borderRadius: '10px',
//                 border: '1px solid #EEEFF1',
//                 mb: 1,
//                 justifyContent: 'flex-start',
//                 px: 0.9
//             }}
//         >
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }}>
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         border: '1px solid #EEEFF1',
//                         borderRadius: '5px',
//                         p: '2px',
//                     }}
//                 >
//                     {props.icon}
//                 </Box>
//                 <Box component="span" sx={{ textAlign: 'left', color: '#303135' }}>
//                     {props.text}
//                 </Box>
//             </Box>
//         </Button>
//     )
// };

// export default ToolButton;


import { Button, Box } from '@mui/material';

const ToolButton = ({ props }) => {
    return (
        <Button
            fullWidth
            onClick={props.onClick || (() => {})}
            sx={{
                backgroundColor: '#e9fbe5',
                fontSize: 12,
                py: 1,
                borderRadius: '10px',
                border: '1px solid #EEEFF1',
                mb: 1,
                justifyContent: 'flex-start',
                px: 0.9,
                transition: 'background 0.3s ease, transform 0.2s',
                '&:hover': {
                    background: 'linear-gradient(90deg, #ce93d8 0%, #19d078ff 100%)',
                    color: 'white',
                    transform: 'translateY(-1px)',
                    '& .MuiSvgIcon-root': {
                        color: 'white !important'
                    }
                }
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
                        '& .MuiSvgIcon-root': {
                            color: '#577f5cff' 
                        }
                    }}
                >
                    {props.icon}
                </Box>
                <Box component="span" sx={{ textAlign: 'left', color: '#456c4bff' }}>
                    {props.text}
                </Box>
            </Box>
        </Button>
    )
};

export default ToolButton;