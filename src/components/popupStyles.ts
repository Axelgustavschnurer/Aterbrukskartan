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

const PopupLinkOpenData = {
    backgroundColor: "crimson",
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

const PopupLinkEP = {
    backgroundColor: "#F18C00",
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

const Divider = {
    display: "flex",
    flexDirection: "row" as any,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "15px",
}

const DividerLineDesc = {
    width: "45%",
    height: "3px",
    backgroundColor: "#F18C00"
}

const DividerLineVideo = {
    width: "45%",
    height: "3px",
    backgroundColor: "#F54242"
}

const DividerLineCase = {
    width: "45%",
    height: "3px",
    backgroundColor: "#008000"
}

const DividerLineReport = {
    width: "45%",
    height: "3px",
    backgroundColor: "#BA55D3"
}

const DividerLineOpen = {
    width: "45%",
    height: "3px",
    backgroundColor: "crimson"
}

const DividerLineEP = {
    width: "45%",
    height: "3px",
    backgroundColor: "#F18C00"
}

const PopupDesc = {
    maxHeight: "200px",
    overflowY: "auto" as any,
}

export { PopupHead, PopupText, flexRow, AlignLinks, PopupLinkPdf, PopupLinkReport, PopupLinkOpenData, PopupLinkEP, Divider, DividerLineDesc, DividerLineVideo, DividerLineCase, DividerLineReport, DividerLineOpen, DividerLineEP, PopupDesc };