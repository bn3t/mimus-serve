import { memo } from "react";
import { Alert, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";

import MimusServeAdmin from "$lib/api/mimus-serve-admin";

const { Title } = Typography;

const SettingsPage = () => {
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["configuration"],
    MimusServeAdmin.getConfiguraton,
  );

  return (
    <>
      {isError && (
        <Alert
          message="Error"
          description="There was an error when loading the configuration."
          type="error"
          showIcon
        />
      )}
      {isLoading && <Spin tip="Loading" size="large" />}
      {isSuccess && (
        <>
          <Title>Settings</Title>
          <pre>{JSON.stringify(data, undefined, "  ")}</pre>
        </>
      )}
    </>
  );
};

export default memo(SettingsPage);
