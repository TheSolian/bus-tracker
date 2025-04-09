import { SidebarProvider } from '@/components/ui/sidebar';
import { HomeLayout } from '@/modules/home/ui/layouts/home-layout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <HomeLayout>{children}</HomeLayout>
    </SidebarProvider>
  );
}
