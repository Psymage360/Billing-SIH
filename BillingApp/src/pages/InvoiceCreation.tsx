import React from "react";
import { IonApp,IonContent,IonInput,IonButton } from "@ionic/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import BlankForm from "../components/BlankForm";
const InvoiceForm: React.FC = () => {
    return ( 
        <IonApp>
            <IonContent>
                <BlankForm/>
            </IonContent>
        </IonApp>
    );
};
export default InvoiceForm;