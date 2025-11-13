import React from 'react';

type PageProps = {
    children: React.ReactNode;
    className?: string;
};

const Page = (props: PageProps) => {
    const { children, className } = props;
    return <div className={className}>{children}</div>;
};

export default Page;
