import { styled } from '@mui/material/styles';
import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

const StyledTooltip = styled(({ className, ...props }: { className?: string } & Omit<TooltipProps, 'classes'>) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#1e293b',
        color: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: 400,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        maxWidth: '220px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#1e293b',
    },
}));

// Domyślne właściwości tooltip
export const tooltipDefaultProps = {
    arrow: true,
    enterDelay: 700,
    leaveDelay: 100,
};

export default StyledTooltip;