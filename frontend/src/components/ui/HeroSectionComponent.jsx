import { Box, Typography, Button, Fade } from '@mui/material';
import { styled } from '@mui/system';
import { Rocket, PlayArrow } from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(8, 4),
    textAlign: 'center',
    marginBottom: theme.spacing(5),
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 'inherit',
    }
}));

const HeroSectionComponent = () => {
    return (
        <Fade in timeout={800}>
            <HeroSection>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                    Welcome to VPFlow
                    <Rocket sx={{ fontSize: 48, ml: 2, animation: 'bounce 2s infinite' }} />
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                    Your comprehensive project management and workflow automation platform.
                    Transform the way your team collaborates and delivers results.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #ff6b6b, #ffa726)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                        }
                    }}
                >
                    Start Your Journey
                </Button>
            </HeroSection>
        </Fade>
    )
}

export default HeroSectionComponent;