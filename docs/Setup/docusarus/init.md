# Setup

1. Install the docusaurus
    Get the lastest version and install

    ```sh
        npx create-docusaurus@latest my-website classic
    ```

2. Install the openapi plugin

    - install

        ```sh
            npm install docusaurus-plugin-openapi-docs
            npm install docusaurus-theme-openapi-docs
        ```

    - edit the run script:

        ```json
        "scripts": {
            "docusaurus": "docusaurus",
            "start": "npm run gen-all && docusaurus start",
            "build": "npm run gen-all && docusaurus build",
            "swizzle": "docusaurus swizzle",
            "deploy": "docusaurus deploy",
            "clear": "docusaurus clear",
            "serve": "docusaurus serve",
            "write-translations": "docusaurus write-translations",
            "write-heading-ids": "docusaurus write-heading-ids",
            "gen-api-docs": "docusaurus gen-api-docs",
            "clean-api-docs": "docusaurus clean-api-docs",
            "gen-api-docs:version": "docusaurus gen-api-docs:version",
            "clean-api-docs:version": "docusaurus clean-api-docs:version",
            "gen-all": "docusaurus gen-api-docs all --all-versions",
            "clean-all": "docusaurus clean-api-docs all --all-versions",
            "re-gen": "npm run clean-all && npm run gen-all"
        },
        ```

    - Custom badge

        OpenApi uses css to show badge. In the `src/css/custom.css` add:

        ```css
            .api-method > .menu__link {
            align-items: center;
            justify-content: start;
            }
            .api-method > .menu__link::before {
            width: 55px;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            text-transform: uppercase;
            font-weight: 600;
            border-radius: 0.25rem;
            align-content: start;
            margin-right: var(--ifm-spacing-horizontal);
            text-align: right;
            flex-shrink: 0;
            border-color: transparent;
            }

            .get > .menu__link::before {
            content: "get";
            color: var(--ifm-color-info);
            }

            .post > .menu__link::before {
            content: "post";
            color: var(--ifm-color-success);
            }

            .delete > .menu__link::before {
            content: "del";
            color: var(--ifm-color-danger);
            }

            .put > .menu__link::before {
            content: "put";
            color: var(--ifm-color-warning);
            }

            .patch > .menu__link::before {
            content: "patch";
            color: var(--ifm-color-warning);
            }

            .head > .menu__link::before {
            content: "head";
            color: var(--ifm-color-secondary-contrast-foreground);
            }

            .event > .menu__link::before {
            content: "event";
            color: var(--ifm-color-secondary-contrast-foreground);
            }

            .schema > .menu__link::before {
            content: "schema";
            color: var(--ifm-color-secondary-contrast-foreground);
            }
        ```

3. start

    ```bash
    npm start
    ```
