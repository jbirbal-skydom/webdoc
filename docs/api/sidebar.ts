import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/sample-api",
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "api/get-a-list-of-users",
          label: "Get a list of users",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
