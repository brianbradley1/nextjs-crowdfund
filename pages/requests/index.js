import React, { useState } from "react";
import { Button } from "@material-ui/core";
import Layout from "../../components/Layout";
import { Link } from "../../routes";
import Campaign from "../../ethereum/campaign";
import RequestRow from "../../components/RequestRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@mui/material/Snackbar";

RequestIndex.getInitialProps = async ({ query }) => {
  const { address } = query;
  const campaign = Campaign(address);

  const requestCount = await campaign.methods.getRequestCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  // workaround as solidity doesnt have support for getting array of structs
  const requests = await Promise.all(
    // array.fill - returns array with 1 empty index
    // Array constructor expects number not a string, so need to parse
    Array(parseInt(requestCount))
      .fill()
      // say to count from array index up to request count
      .map((element, index) => {
        // returns instance of each request
        return campaign.methods.requests(index).call();
      })
  );

  return { address, requests, requestCount, approversCount };
};

function RequestIndex({ address, requests, requestCount, approversCount }) {
  const { Header, Row, HeaderCell, Body } = Table;
  const [errorMessage, setErrorMessage] = useState("");

  const [openApprove, setOpenApprove] = useState(false);
  const [openFinalise, setOpenFinalise] = useState(false);
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("center");

  // Create callback function and pass to RequestRow (child) as props
  // Child component will call this and pass data back to parent
  const updateErrorMessage = (childData) => {
    setErrorMessage(childData);
  };

  const updateApprovalFlag = (childData) => {
    setOpenApprove(childData);
  };

  const updateFinaliseFlag = (childData) => {
    setOpenFinalise(childData);
  };

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
          updateErrorMessage={updateErrorMessage}
          updateApprovalFlag={updateApprovalFlag}
          updateFinaliseFlag={updateFinaliseFlag}
        />
      );
    });
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}`}>
        <a>Back</a>
      </Link>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
          >
            Add Request
          </Button>
        </a>
      </Link>
      <h3>Requests</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell>Approval Count</TableCell>
            <TableCell>Approve</TableCell>
            <TableCell>Finalize</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows()}</TableBody>
      </Table>
      <div>Found {requestCount} requests.</div>{" "}
        <Snackbar
          anchorOrigin={{
            vertical: vertical,
            horizontal: horizontal,
          }}
          open={openApprove}
          autoHideDuration={3000}
          key={vertical + horizontal + "1"}
        >
          <Alert
            onClose={() => setOpenApprove(false)}
            severity="success"
          >
            Request was successfully approved!
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: vertical,
            horizontal: horizontal,
          }}
          open={openFinalise}
          autoHideDuration={3000}
          key={vertical + horizontal + "2"}
        >
          <Alert
            onClose={() => setOpenFinalise(false)}
            severity="success"
          >
            Request was successfully finalised!
          </Alert>
        </Snackbar>
      <br />
      {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
    </Layout>
  );
}

export default RequestIndex;
