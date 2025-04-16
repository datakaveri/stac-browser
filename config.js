module.exports = {
    catalogUrl: null,
    catalogTitle: "STAC Browser",
    allowExternalAccess: true, // Must be true if catalogUrl is not given
    allowedDomains: [],
    detectLocaleFromBrowser: true,
    storeLocale: true,
    locale: "en",
    fallbackLocale: "en",
    supportedLocales: [
        "de",
//      "de-CH",
        "es",
        "en",
//      "en-GB",
//      "en-US",
        "fr",
//      "fr-CA",
//      "fr-CH",
        "it",
//      "it-CH",
        "ro",
        "ja",
        "pt",
//      "pt-BR"
    ],
    apiCatalogPriority: null,
    useTileLayerAsFallback: true,
    displayGeoTiffByDefault: false,
    buildTileUrlTemplate: ({href, asset}) => "https://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=" + encodeURIComponent(href),
    stacProxyUrl: null,
    pathPrefix: "/",
    historyMode: "history",
    cardViewMode: "cards",
    cardViewSort: "asc",
    showKeywordsInItemCards: false,
    showKeywordsInCatalogCards: false,
    showThumbnailsAsAssets: false,
    geoTiffResolution: 128,
    redirectLegacyUrls: false,
    itemsPerPage: 12,
    maxItemsPerPage: 1000,
    defaultThumbnailSize: null,
    maxPreviewsOnMap: 50,
    crossOriginMedia: null,
    requestHeaders: {},
    requestQueryParameters: {},
    socialSharing: ['email', 'bsky', 'mastodon', 'x'],
    preprocessSTAC: null,
    // authConfig: {
    //   type: 'apiKey',
    //   in: 'header',
    //   name: 'Authorization',
    //   formatter: token => `Bearer ${token}`, // This is an example, there's also the simpler variant to just provide the string 'Bearer' in this case
    //   description: `Please retrieve the token from our [API console](https://example.com/api-console).\n\nFor further questions contact <mailto:support@example.com>.`
    // },
    authConfig: {
        type: "openIdConnect",
        openIdConnectUrl:
          "https://keycloak-update.iudx.io/auth/realms/demo/.well-known/openid-configuration",
        oidcConfig: {
          client_id: "angular-iudx-client",
        },
      },
      dxConfig: {
        dxUrl: "https://api.cat-test.iudx.io",
        dxCatBasePath: "/iudx/cat/v1",
      },
      catalogUrl: "https://ogc.iudx.io/stac",
    
      allowedDomains: ["geoserver.dx.geospatial.org.in"],
      // dxConfig: {
      //   dxUrl: "https://dx.gsx.org.in",
      //   dxCatBasePath: "/ugix/cat/v1",
      // },
      // catalogUrl: "https://geoserver.dx.gsx.org.in/stac",
    
      // allowedDomains: ["geoserver.dx.gsx.org.in"]
};
