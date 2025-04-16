/**
 * Class for DX-related operations.
 *
 * @class
 */
export default class Dx {
  /**
   * Get a DX token for downloading a STAC Asset.
   *
   * If the resource associated with the asset is open, an open token/identity token is returned. Else an attempt is made
   * to get a secure token.
   *
   * @param {string} collection_id - the STAC collection ID of the STAC Asset, also the DX resource ID.
   * @param {string} oidc_token - the OIDC/Keycloak token used to interact with the DX AAA server.
   * @param {*} config - the STAC Browser config.
   * @returns {string} - the DX token to access the resource.
   */
  static async getDxToken(collection_id, oidc_token, config) {
    if (collection_id == null || oidc_token == null) {
      console.error(
        "Failed to download the asset - collection_id or OIDC/Keycloak token was null/undefined"
      );
      throw new Error("Failed to download the asset");
    }
    if (
      !("dxConfig" in config) ||
      !("dxUrl" in config.dxConfig) ||
      !("dxCatBasePath" in config.dxConfig)
    ) {
      console.error("Failed to download the asset - bad server configuration");
      throw new Error("Failed to download asset");
    }

    const dx_url = config["dxConfig"]["dxUrl"];
    const dx_cat_base_path = config["dxConfig"]["dxCatBasePath"];

    let cat_relation_check;
    let dx_cat_response = {};

    let dx_cat_relationship_query_url = `${dx_url}${dx_cat_base_path}/relationship?id=${collection_id}&rel=all`;

    try {
      cat_relation_check = await fetch(dx_cat_relationship_query_url);
      dx_cat_response = await cat_relation_check.json();

      if (cat_relation_check.status == 400) {
        throw new Error(
          `No resource found for STAC Collection ${collection_id} on DX Catalogue`
        );
      } else if (cat_relation_check.status > 400) {
        throw new Error(`DX Catalogue failed to reply`);
      }
    } catch (e) {
      console.error(
        `DX Catalogue relationship query failed`,
        cat_relation_check
      );

      if (e instanceof TypeError || e instanceof SyntaxError) {
        throw new Error("DX Catalogue returned a non-JSON response");
      } else {
        throw e;
      }
    }

    let resource_item_arr = dx_cat_response.results.filter((i) =>
      i.type[0].endsWith("Resource")
    );

    if (resource_item_arr.length == 0) {
      console.error(
        `DX Catalogue relationship API call for ${collection_id} returned no Resource field`
      );
      throw new Error("DX Catalogue returned an invalid response");
    }

    let res_server_item_arr = dx_cat_response.results.filter((i) =>
      i.type[0].endsWith("ResourceServer")
    );

    if (res_server_item_arr.length == 0) {
      console.error(
        `DX Catalogue relationship API call for ${collection_id} returned no Resource Server field`
      );
      throw new Error("DX Catalogue returned an invalid response");
    }

    const resource_item_policy = resource_item_arr[0].accessPolicy;
    const resource_server_url = res_server_item_arr[0]['resourceServerRegURL'];

    let dx_token_req_body = {};

    if (resource_item_policy == "OPEN") {
      dx_token_req_body = {
        itemId: resource_server_url,
        itemType: "resource_server",
        role: "consumer",
      };
    } else if (resource_item_policy == "SECURE") {
      dx_token_req_body = {
        itemId: collection_id,
        itemType: "resource",
        role: "consumer",
      };
    } else {
      console.error(`DX Catalogue relationship query`, cat_relation_check);
      throw new Error(
        "Failed to get token from DX AAA - Unrecognized access policy for resource"
      );
    }

    const authOptions = {
      method: "POST",
      body: JSON.stringify(dx_token_req_body),
      headers: {
        Authorization: "Bearer " + oidc_token,
        "Content-type": "application/json",
      },
    };

    try {
      const data = await fetch(`${dx_url}/auth/v1/token`, authOptions);
      if (data.status >= 400) {
        let msg;
        switch (data.status) {
          case 401:
            msg = `Failure in DX AAA token request`;
            console.error(`DX AAA token request failure`, data);
            break;
          case 403:
            msg = `You do not have access to this asset, please request for access on the DX Catalogue`;
            break;
          default:
            msg = "Failure in DX AAA token request";
            console.error(`DX AAA token request failure`, data);
            break;
        }
        throw new Error(msg);
      }

      let json = await data.json();
      if ("results" in json && "accessToken" in json.results) {
        return json.results.accessToken;
      } else {
        console.error(`DX AAA token request failure`, data);
        throw new Error("Failure in DX AAA token request");
      }
    } catch (error) {
      throw error;
    }
  }
}
