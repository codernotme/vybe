// src/lib/withRole.tsx
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import React from 'react';

function withRole(WrappedComponent: React.FC, allowedRoles: string[]) {
  const WithRoleComponent = (props: any) => {
    const { user } = useUser();
    const router = useRouter();

    // Check if the user has one of the allowed roles
    if (!user || !allowedRoles.includes(user?.publicMetadata?.role as string)) {
      router.replace('/not-authorized'); // redirect unauthorized users
      return null; // render nothing while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  WithRoleComponent.displayName = `WithRole(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithRoleComponent;
}

export default withRole;
