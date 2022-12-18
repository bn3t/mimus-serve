import { useCallback, useMemo, useState } from "react";
import { Table, Typography, Space, Button, Alert, Popover, Select } from "antd";
import { ColumnsType } from "antd/es/table";

import {
  useResetScenariosMutation,
  useResetScenarioStateMutation,
  useScenariosQuery,
  useSetScenarioStateMutation,
} from "$lib/hooks/query-scenarios";
import { Scenario } from "$lib/api/model";

const { Title } = Typography;

interface SetScenarioStatePopoverProps {
  state: string;
  possibleStates: string[];
  onNewStateSet: (newState: string) => void;
}

const SetScenarioStatePopover = ({
  possibleStates,
  state,
  onNewStateSet,
}: SetScenarioStatePopoverProps) => {
  const [opened, setOpened] = useState(false);
  const [newStateValue, setNewStateValue] = useState(state);

  const handleClickChange = (open: boolean) => {
    setOpened(open);
  };
  return (
    <Popover
      open={opened}
      content={
        <Space direction="horizontal">
          <Select
            style={{ width: 200 }}
            value={newStateValue}
            onChange={(value) => {
              setNewStateValue(value);
            }}
            options={possibleStates.map((state) => ({
              value: state,
              label: state,
            }))}
          />
          <Button
            type="primary"
            onClick={() => {
              onNewStateSet(newStateValue);
              setOpened(false);
            }}
          >
            Set
          </Button>
        </Space>
      }
      title="Set new state"
      trigger="click"
      onOpenChange={handleClickChange}
    >
      <Button>Set state</Button>
    </Popover>
  );
};

const columns: ColumnsType<Scenario> = [
  {
    title: "Name",
    ellipsis: true,
    dataIndex: "name",
    width: "50%",
    key: "name",
  },
  {
    title: "State",
    dataIndex: "state",
    width: "20%",
    key: "method",
  },
];

export default function ScenariosPage() {
  const { data, isLoading, refetch } = useScenariosQuery();
  const {
    mutate: mutateResetScenarios,
    isLoading: isLoadingResetScenarios,
    isError: isErrorResetScenarios,
    error: errorResetScenarios,
  } = useResetScenariosMutation({ onSuccess: () => refetch() });
  const {
    mutate: mutateResetScenarioState,
    isLoading: isLoadingResetScenarioState,
    isError: isErrorResetScenarioState,
    error: errorResetScenarioState,
  } = useResetScenarioStateMutation({ onSuccess: () => refetch() });
  const {
    mutate: mutateSetScenarioState,
    isLoading: isLoadingSetScenarioState,
    isError: isErrorSetScenarioState,
    error: errorSetScenarioState,
  } = useSetScenarioStateMutation({ onSuccess: () => refetch() });
  const { isError, error } = useMemo(
    () => ({
      isError:
        isErrorResetScenarioState ||
        isErrorSetScenarioState ||
        isErrorResetScenarios,
      error:
        errorResetScenarioState ?? errorSetScenarioState ?? errorResetScenarios,
    }),
    [
      isErrorResetScenarioState,
      isErrorSetScenarioState,
      isErrorResetScenarios,
      errorResetScenarioState,
      errorSetScenarioState,
      errorResetScenarios,
    ],
  );
  const columnsWithAction = useMemo(
    () => [
      ...columns,
      {
        title: "Action",
        key: "action",
        width: "30%",
        render: (_, record) => (
          <Space size="middle">
            <SetScenarioStatePopover
              state={record.state}
              possibleStates={record.possibleStates}
              onNewStateSet={(newState) =>
                mutateSetScenarioState({
                  scenarioName: record.name,
                  state: newState,
                })
              }
            />
            <Button
              onClick={() => mutateResetScenarioState(record.name)}
              type="primary"
              loading={isLoadingResetScenarioState}
            >
              Reset
            </Button>
          </Space>
        ),
      },
    ],
    [mutateResetScenarioState, mutateSetScenarioState],
  );

  const handleResetAllClick = useCallback(() => {
    mutateResetScenarios();
  }, [mutateResetScenarios]);

  return (
    <>
      <Title>Scenarios</Title>
      <Space direction="vertical">
        {isError && <Alert message={error?.message} type="error" closable />}
        <Button type="primary" onClick={handleResetAllClick}>
          Reset all mocks
        </Button>
        <Table<Scenario>
          rowKey="name"
          columns={columnsWithAction}
          dataSource={data ?? []}
          loading={isLoading}
          bordered={true}
          pagination={{ defaultPageSize: 20, pageSizeOptions: [20, 40, 50] }}
        />
      </Space>
    </>
  );
}
