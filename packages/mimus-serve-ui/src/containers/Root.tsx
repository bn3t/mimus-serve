import {
  HomeOutlined,
  PicCenterOutlined,
  RetweetOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { memo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Header, Content } = Layout;
const { useToken } = theme;

interface RootProps {}

const Root = ({}: RootProps) => {
  const { token } = useToken();
  const navigate = useNavigate();
  const selectedKey = useLocation().pathname;
  return (
    <div
      style={{
        backgroundColor: token.colorBgLayout,
      }}
    >
      <Layout
        style={{
          margin: "auto",
          backgroundColor: token.colorBgContainer,
          maxWidth: 960,
          minHeight: "100vh",
        }}
      >
        <Header
          className="header"
          style={{ backgroundColor: token.colorBgContainer }}
        >
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            selectedKeys={[selectedKey]}
            items={[
              {
                key: "/",
                icon: <HomeOutlined />,
                label: "Home",
                onClick: () => navigate("/"),
              },
              {
                key: "/mappings",
                icon: <RetweetOutlined />,
                label: "Mappings",
                onClick: () => navigate("/mappings"),
              },
              {
                key: "/settings",
                icon: <PicCenterOutlined />,
                label: "Settings",
                onClick: () => navigate("/settings"),
              },
              {
                key: "/scenarios",
                icon: <AlignLeftOutlined />,
                label: "Scenarios",
                onClick: () => navigate("/scenarios"),
              },
            ]}
          />
        </Header>
        <Content
          style={{
            padding: "1rem",
            margin: "2rem 2rem 0 2rem",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default memo(Root);
