import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CommunityPage = ({ children }: Props) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default CommunityPage;
