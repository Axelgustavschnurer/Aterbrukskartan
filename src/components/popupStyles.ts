// This file contains the styles for the popup component used by the map component

const PopupHead = {
    fontWeight: "bold",
    fontSize: "15px",
    marginBottom: "5px"
};

const PopupText = {
    fontSize: "12.8px",
    marginBottom: "5px"
};

const AlignLinks = {
    display: "flex",
    flexDirection: "column" as any,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "3%"
}

const flexRow = {
    display: "flex",
    flexDirection: "row" as any,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
}

const PopupLinkPdf = {
    backgroundColor: "#008000",
    border: "black",
    borderRadius: "25px",
    padding: "5px",
    cursor: "pointer",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const PopupLinkReport = {
    backgroundColor: "#b65ed1",
    border: "black",
    borderRadius: "25px",
    padding: "5px",
    cursor: "pointer",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

export { PopupHead, PopupText, flexRow, AlignLinks, PopupLinkPdf, PopupLinkReport };