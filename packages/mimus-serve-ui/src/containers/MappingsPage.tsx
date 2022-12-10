import { Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";

import { useMappingsQuery } from "$lib/hooks/query-mappings";
import { Mapping } from "$lib/api/model/mappings";

const { Title } = Typography;

const columns: ColumnsType<Mapping> = [
  {
    title: "Name",
    ellipsis: true,
    dataIndex: "name",
    width: 300,
    key: "name",
  },
  {
    title: "Method",
    dataIndex: ["request", "method"],
    width: 100,
    key: "method",
  },
  {
    title: "Url Type",
    dataIndex: ["request", "urlType"],
    width: 100,
    key: "urlType",
  },
  {
    title: "Url",
    dataIndex: ["request", "url"],
    width: 120,
    key: "url",
  },
];

export default function MappingsPage() {
  const { data, isLoading, isError } = useMappingsQuery();

  return (
    <>
      <Title>Mappings</Title>
      <Table<Mapping>
        rowKey="id"
        columns={columns}
        dataSource={data?.mappings}
        loading={isLoading}
        bordered={true}
        pagination={{ defaultPageSize: 20, pageSizeOptions: [20, 40, 50] }}
      />
    </>
  );
}
