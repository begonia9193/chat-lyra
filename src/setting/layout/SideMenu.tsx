import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from '@/components/Icon';

const MenuItem = ({ path, label, isActive, icon }: { path: string; label: string; isActive: boolean; icon: string; }) => {
  const navigate = useNavigate();

  return (
    <div
      className={classNames(
        'flex size-64px flex-col justify-center rd-6px items-center cursor-pointer hover:bg-primary/12%',
        { 'bg-primary/12% text-primary font-500': isActive }
      )}
      onClick={() => navigate(path)}
    >
      <Icon icon={icon} className='size-28px' />
      <span className='text-12px mt-4px'>
        {label}
      </span>
    </div>
  );
};

export const SideMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-80px h-full p-8px b-r-1 b-solid b-line/60% flex flex-col gap-4px">
      <MenuItem
        path="/model-provider"
        label="提供商"
        icon="i-icons-chip"
        isActive={currentPath === '/model-provider'}
      />
      <MenuItem
        path="/mcp"
        label="MCP"
        icon="i-icons-mcp"
        isActive={currentPath === '/mcp'}
      />
    </div>
  );
}; 