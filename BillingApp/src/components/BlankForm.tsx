import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonLabel,
  IonButton,
  IonList,
  IonItem,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from "@ionic/react";
import { add, document, globe, chevronUpCircle } from "ionicons/icons";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import fs from "fs";
import { useHistory } from "react-router-dom";
import { Storage } from 'aws-amplify';
(window as any).global = window;


const InvoiceForm: React.FC = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: "",
    dateTime: new Date().toISOString(),
    billTo: {
      name: "",
      address: "",
      city: "",
      pincode: "",
    },
    shipTo: {
      name: "",
      address: "",
      city: "",
      pincode: "",
    },
    items: [],
  });
  const history = useHistory(); 
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const handleInvoiceNumberChange = (e: CustomEvent) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      invoiceNumber: e.detail.value!,
    }));
  };

  const handleBillToChange = (
    field: keyof Invoice["billTo"],
    e: CustomEvent
  ) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      billTo: {
        ...prevInvoice.billTo,
        [field]: e.detail.value!,
      },
    }));
  };

  const handleShipToChange = (
    field: keyof Invoice["shipTo"],
    e: CustomEvent
  ) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      shipTo: {
        ...prevInvoice.shipTo,
        [field]: e.detail.value!,
      },
    }));
  };

  const handleDescriptionChange = (index: number, e: CustomEvent) => {
    setInvoice((prevInvoice) => {
      const newItems = [...prevInvoice.items];
      newItems[index].description = e.detail.value!;
      return {
        ...prevInvoice,
        items: newItems,
      };
    });
  };

  const handleAmountChange = (index: number, e: CustomEvent) => {
    setInvoice((prevInvoice) => {
      const newItems = [...prevInvoice.items];
      const newAmount = parseFloat(e.detail.value!);
      newItems[index].amount = isNaN(newAmount) ? 0 : newAmount;
      setTotalAmount(newItems[index].amount);
      return {
        ...prevInvoice,
        items: newItems,
      };
    });
  };

  const handleAddRow = () => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, { description: "", amount: 0 }],
    }));
  };

  const handleRemoveRow = (index: number) => {
    setInvoice((prevInvoice) => {
      const newItems = [...prevInvoice.items];
      newItems.splice(index, 1);
      return {
        ...prevInvoice,
        items: newItems,
      };
    });
  };
  const generateCSVContent = () => {
    const rows = [];
    rows.push([
      "Invoice Number",
      "Date Time",
      "Bill To Name",
      "Bill To Address",
      "Bill To City",
      "Bill To Pincode",
      "Ship To Name",
      "Ship To Address",
      "Ship To City",
      "Ship To Pincode",
    ]);
    rows.push([
      invoice.invoiceNumber,
      invoice.dateTime,
      invoice.billTo.name,
      invoice.billTo.address,
      invoice.billTo.city,
      invoice.billTo.pincode,
      invoice.shipTo.name,
      invoice.shipTo.address,
      invoice.shipTo.city,
      invoice.shipTo.pincode,
    ]);
    for (const item of invoice.items) {
      rows.push([item.description, item.amount]);
    }
    const csv = Papa.unparse(rows);
    return csv;
  };
  const handleExportCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "invoice.csv");
  };
  const handleSaveInvoice = async (invoiceId: string, invoice: Invoice) => {
    try {
      await Storage.put(`invoices/${invoiceId}`, JSON.stringify(invoice));
      history.push("/home");
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  }
  const handleSave = () => {
    // TODO: Save invoice data
    if (
      invoice.invoiceNumber.trim() === "" ||
      invoice.billTo.name.trim() === "" ||
      invoice.billTo.address.trim() === "" ||
      invoice.billTo.city.trim() === "" ||
      invoice.billTo.pincode.trim() === "" ||
      invoice.shipTo.name.trim() === "" ||
      invoice.shipTo.address.trim() === "" ||
      invoice.shipTo.city.trim() === "" ||
      invoice.shipTo.pincode.trim() === "" ||
      invoice.items.some((item) => item.description.trim() === "")
    ) {
      alert("Please fill in all fields");
      return;
    }
    const total = invoice.items.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(total);
    setIsSaveClicked(true);
    const invoiceId = invoice.invoiceNumber+"-"+invoice.dateTime;
    handleSaveInvoice(invoiceId, invoice);
   };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Invoice</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonTitle size="large">Invoice Details</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel position="floating">Invoice Number</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.invoiceNumber}
                        onIonChange={handleInvoiceNumberChange}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Date and Time</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.dateTime}
                        readonly
                      ></IonInput>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonTitle size="large">Bill To</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel position="floating">Name</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.billTo.name}
                        onIonChange={(e) => handleBillToChange("name", e)}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Address</IonLabel>
                      <IonTextarea
                        value={invoice.billTo.address}
                        onIonChange={(e) => handleBillToChange("address", e)}
                      ></IonTextarea>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">City</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.billTo.city}
                        onIonChange={(e) => handleBillToChange("city", e)}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Pincode</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.billTo.pincode}
                        onIonChange={(e) => handleBillToChange("pincode", e)}
                      ></IonInput>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonTitle size="large">Ship To</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel position="floating">Name</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.shipTo.name}
                        onIonChange={(e) => handleShipToChange("name", e)}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Address</IonLabel>
                      <IonTextarea
                        value={invoice.shipTo.address}
                        onIonChange={(e) => handleShipToChange("address", e)}
                      ></IonTextarea>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">City</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.shipTo.city}
                        onIonChange={(e) => handleShipToChange("city", e)}
                      ></IonInput>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Pincode</IonLabel>
                      <IonInput
                        type="text"
                        value={invoice.shipTo.pincode}
                        onIonChange={(e) => handleShipToChange("pincode", e)}
                      ></IonInput>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonTitle size="large">Items</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4">Description</th>
                        <th className="py-2 px-4">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <IonInput
                              type="text"
                              className="border border-gray-300 px-2 py-1 w-full"
                              value={item.description}
                              onIonChange={(e) =>
                                handleDescriptionChange(index, e)
                              }
                            ></IonInput>
                          </td>
                          <td>
                            <IonInput
                              type="number"
                              className="border border-gray-300 px-2 py-1 w-full"
                              value={item.amount}
                              onIonChange={(e) => handleAmountChange(index, e)}
                            ></IonInput>
                          </td>
                          <td>
                            <IonButton
                              color="danger"
                              fill="clear"
                              onClick={() => handleRemoveRow(index)}
                            >
                              Remove
                            </IonButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <IonButton color="primary" onClick={handleAddRow}>
                    Add Row
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonTitle size="large">Total Amount: {totalAmount}</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton color="success" onClick={handleSave}>
                    Save
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
        {isSaveClicked && (
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton>
              <IonIcon icon={chevronUpCircle}></IonIcon>
            </IonFabButton>
            <IonFabList side="top">
              <IonFabButton onClick={handleExportCSV}>
                <IonIcon icon={document}></IonIcon>
              </IonFabButton>
              <IonFabButton>
                <IonIcon icon={globe}></IonIcon>
              </IonFabButton>
            </IonFabList>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default InvoiceForm;
