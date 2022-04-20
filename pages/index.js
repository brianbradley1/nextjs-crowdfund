import React, { Component } from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";
import {
  Typography,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Toolbar,
  Container,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
//import useStyles from "../styles";

class CampaignIndex extends Component {
  //readonly classes = useStyles();

  // exclusive method to next js
  // use static keyword so can fetch data without rendering component
  static async getInitialProps() {
    //console.log("Index. GetInitialProps = " + process.env.DEPLOYED_CONTRACT_ADDRESS);
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  render() {
    return (
      <Layout>
        <div style={{ padding: "20px 0" }}>
          <Container maxWidth="sm">
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Open Campaigns
            </Typography>
            <div style={{ marginTop: "40px" }}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Link route="/campaigns/new">
                    <a>
                      <Button variant="contained" color="primary">
                        Create Campaign
                      </Button>
                    </a>
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container style={{ padding: "20px 0" }} maxWidth="md">
          <Grid container spacing={4}>
            {this.props.campaigns.map((address) => (
              <Grid item key={address} xs={12} sm={6} md={6}>
                <Card
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {address}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link route={`/campaigns/${address}`}>
                      <a>View Campaign</a>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Layout>
    );
  }
}

export default CampaignIndex;
