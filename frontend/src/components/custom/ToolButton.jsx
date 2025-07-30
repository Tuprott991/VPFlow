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
                backgroundColor: '#fbfbfbff',
                fontSize: 12,
                py: 1,
                borderRadius: '10px',
                border: '1px solid #d4e6d4',
                mb: 1,
                justifyContent: 'flex-start',
                px: 0.9,
                transition: 'all 0.3s ease',
                '&:hover': {
                    background: 'linear-gradient(90deg, #66bb6a 0%, #4caf50 100%)',
                    color: 'white',
                    transform: 'translateY(-1px)',
                    borderColor: '#4caf50',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                    '& .icon-container': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'white !important'
                    }
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }}>
                <Box
                    className="icon-container"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #c8e6c9',
                        borderRadius: '5px',
                        p: '2px',
                        backgroundColor: '#e8f5e8',
                        transition: 'all 0.3s ease',
                        '& .MuiSvgIcon-root': {
                            color: '#388e3c',
                            transition: 'color 0.3s ease'
                        }
                    }}
                >
                    {props.icon}
                </Box>
                <Box component="span" sx={{ 
                    textAlign: 'left', 
                    color: '#000000ff',
                    fontWeight: 500,
                    transition: 'color 0.3s ease'
                }}>
                    {props.text}
                </Box>
            </Box>
        </Button>
    )
};

export default ToolButton;