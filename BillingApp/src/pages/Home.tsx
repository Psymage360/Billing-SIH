import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonImg,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import "./Home.css";
import { logoIonic, create, fileTrayStacked } from "ionicons/icons";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { useHistory } from "react-router-dom";
import Blank from "../components/Blank";
import InvoiceCreation from "./InvoiceCreation";

const Home: React.FC = () => {
  const history = useHistory(); // Initialize useHistory
  const handleCreateInvoiceClick = () => {
    history.push("/home/create-invoice"); // Navigate to the CreateInvoice page
  };
  const handleViewInvoiceClick = () => {
    history.push("/home/ViewInvoice"); // Navigate to the ViewInvoice page
  };
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Welcome, User!</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          className="ion-padding"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <IonCard
              color="tertiary"
              className="ion-padding ion-margin"
              style={{
                borderRadius: "20px",
                display: "block",
              }}
            >
              <IonCardHeader>
                <IonCardTitle>View All Invoices</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                View all your invoices here. You can also remove them.
              </IonCardContent>
              <IonButton
                shape="round"
                icon-only
                aria-label="Favorite"
                onClick={handleViewInvoiceClick}
              >
                <IonIcon icon={fileTrayStacked} size="medium"></IonIcon>
              </IonButton>
            </IonCard>
            <IonCard
              color="tertiary"
              className="ion-padding ion-margin"
              style={{
                borderRadius: "20px",
                display: "block",
              }}
            >
              <IonCardHeader>
                <IonCardTitle>Create invoice</IonCardTitle>
                <IonCardSubtitle>It's good to keep track!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                Create an Invoice to keep track of your expenses. Save it for
                later,locally or on cloud, or send it to your client.
              </IonCardContent>
              <IonButton
                shape="round"
                icon-only
                onClick={handleCreateInvoiceClick}
                aria-label="Favorite"
              >
                <IonIcon icon={create} size="medium"></IonIcon>
              </IonButton>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};
export default Home;
