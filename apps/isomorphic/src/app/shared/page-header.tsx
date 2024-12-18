import { Title } from 'rizzui';
import cn from '@core/utils/class-names';
import Breadcrumb from '@core/ui/breadcrumb';

export type PageHeaderTypes = {
  title: string | undefined;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
};

export default function PageHeader({
  title,
  breadcrumb,
  children,
  className,
}: React.PropsWithChildren<PageHeaderTypes>) {
  return (
    <header className={cn('mb-6 @container xs:-mt-2 lg:mb-7', className)}>
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between">
        <div>
          {title && (
            <Title
              as="h2"
              className="mb-2 mt-2 font-lexendBold text-[22px] lg:text-2xl 4xl:text-[26px]"
            >
              {title}
            </Title>
          )}

          {breadcrumb.length ? (
            <Breadcrumb
              separator=""
              separatorVariant="circle"
              className="flex-wrap"
            >
              {breadcrumb.map((item) => (
                <Breadcrumb.Item
                  key={item.name}
                  {...(item?.href && { href: item?.href })}
                >
                  {item.name}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          ) : (
            ''
          )}
        </div>
        {children}
      </div>
    </header>
  );
}
