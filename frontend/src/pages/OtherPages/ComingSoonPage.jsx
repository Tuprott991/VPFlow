import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Stack,
    Divider,
    Link as MuiLink,
    useTheme,
    useMediaQuery,
    Fade,
    Slide,
    Zoom
} from '@mui/material';
import {
    Home,
    ArrowBack,
    Search,
    HelpOutline,
    ContactSupport,
    AccountTree // Thay thế Sitemap
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';

const smoothFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(1deg);
  }
  50% {
    transform: translateY(-4px) rotate(0deg);
  }
  75% {
    transform: translateY(-12px) rotate(-1deg);
  }
`;

const gentlePulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
`;

const rippleEffect = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const NotFoundPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}08 0%, ${theme.palette.background.default} 30%, ${theme.palette.secondary.light}08 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                py: 4
            }}
        >
            {/* Enhanced Background Decorations */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-15%',
                    right: '-15%',
                    width: '500px',
                    height: '500px',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}15, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(120px)',
                    animation: `${gentlePulse} 6s ease-in-out infinite`,
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-15%',
                    width: '400px',
                    height: '400px',
                    background: `radial-gradient(circle, ${theme.palette.secondary.main}12, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    animation: `${gentlePulse} 8s ease-in-out infinite`,
                    animationDelay: '2s',
                    zIndex: 0
                }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in timeout={1000}>
                    <Paper
                        elevation={16}
                        sx={{
                            p: { xs: 4, md: 6 },
                            textAlign: 'center',
                            borderRadius: 6,
                            background: `linear-gradient(145deg, ${theme.palette.background.paper}95, ${theme.palette.background.default}90)`,
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${theme.palette.divider}40`,
                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[20]
                            }
                        }}
                    >
                        {/* Animated 404 Number */}
                        <Zoom in timeout={1200}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    mb: 4,
                                    animation: `${smoothFloat} 6s ease-in-out infinite`
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '6rem', md: '8rem', lg: '10rem' },
                                        fontWeight: 800,
                                        background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                        backgroundSize: '400% 400%',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        animation: `${gradientShift} 4s ease infinite`,
                                        letterSpacing: '-0.05em',
                                        textShadow: 'none',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                                    }}
                                >
                                    404
                                </Typography>

                                {/* Ripple Effect */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '200px',
                                        height: '200px',
                                        border: `2px solid ${theme.palette.primary.main}30`,
                                        borderRadius: '50%',
                                        animation: `${rippleEffect} 3s ease-out infinite`
                                    }}
                                />
                            </Box>
                        </Zoom>

                        {/* Animated Search Icon */}
                        <Slide direction="up" in timeout={1400}>
                            <Box
                                sx={{
                                    mb: 4,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        animation: `${gentlePulse} 3s ease-in-out infinite`,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            background: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.secondary.light}30)`
                                        }
                                    }}
                                >
                                    <Search
                                        sx={{
                                            fontSize: 70,
                                            color: theme.palette.primary.main,
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Slide>

                        {/* Error Messages with Staggered Animation */}
                        <Slide direction="up" in timeout={1600}>
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Oops! Page Not Found
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        lineHeight: 1.6
                                    }}
                                >
                                    The page you're looking for might have been removed, renamed, or is temporarily unavailable.
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.disabled"
                                    sx={{
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Please check the URL or return to the homepage.
                                </Typography>
                            </Stack>
                        </Slide>

                        {/* Enhanced Action Buttons */}
                        <Slide direction="up" in timeout={1800}>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                sx={{ mb: 4 }}
                                justifyContent="center"
                            >
                                <Button
                                    component={Link}
                                    to="/"
                                    variant="contained"
                                    size="large"
                                    startIcon={<Home />}
                                    sx={{
                                        px: 5,
                                        py: 2,
                                        borderRadius: 4,
                                        textTransform: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                            transform: 'translateY(-3px) scale(1.02)',
                                            boxShadow: `0 12px 32px ${theme.palette.primary.main}50`
                                        },
                                        '&:active': {
                                            transform: 'translateY(-1px) scale(0.98)'
                                        }
                                    }}
                                >
                                    Go to Homepage
                                </Button>

                                <Button
                                    onClick={handleGoBack}
                                    variant="outlined"
                                    size="large"
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        px: 5,
                                        py: 2,
                                        borderRadius: 4,
                                        textTransform: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderWidth: 2,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'translateY(-3px) scale(1.02)',
                                            boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                                            backgroundColor: `${theme.palette.primary.main}08`
                                        },
                                        '&:active': {
                                            transform: 'translateY(-1px) scale(0.98)'
                                        }
                                    }}
                                >
                                    Go Back
                                </Button>
                            </Stack>
                        </Slide>

                        <Fade in timeout={2000}>
                            <Divider sx={{ mb: 3, opacity: 0.6 }} />
                        </Fade>

                        {/* Enhanced Help Links */}
                        <Fade in timeout={2200}>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{ mb: 2, fontWeight: 500 }}
                                >
                                    Need help?
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={4}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <MuiLink
                                        component={Link}
                                        to="/contact"
                                        underline="none"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                color: theme.palette.primary.dark,
                                                transform: 'translateY(-2px)',
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <ContactSupport fontSize="small" />
                                        Contact Support
                                    </MuiLink>

                                    <MuiLink
                                        component={Link}
                                        to="/help"
                                        underline="none"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                color: theme.palette.primary.dark,
                                                transform: 'translateY(-2px)',
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <HelpOutline fontSize="small" />
                                        Help Center
                                    </MuiLink>

                                    <MuiLink
                                        component={Link}
                                        to="/sitemap"
                                        underline="none"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                color: theme.palette.primary.dark,
                                                transform: 'translateY(-2px)',
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <AccountTree fontSize="small" />
                                        Site Map
                                    </MuiLink>
                                </Stack>
                            </Box>
                        </Fade>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default NotFoundPage;