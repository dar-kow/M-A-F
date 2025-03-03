import { ReactNode } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './MainLayout.scss';

interface MainLayoutProps {
    children: ReactNode;
    onPrint?: () => void;
    pageTitle?: string;
}

function MainLayout({ children, onPrint, pageTitle }: MainLayoutProps) {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar onPrint={onPrint} pageTitle={pageTitle} />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;