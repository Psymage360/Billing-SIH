import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";

type Row = {
  description: string;
  amount: number;
};
const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([{ description: "", amount: 0 }]);
  const [total, setTotal] = useState<number>(0);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].description = value;
    setRows(updatedRows);
  };

  const handleAmountChange = (index: number, value: number) => {
    const updatedRows = [...rows];
    updatedRows[index].amount = value;
    setRows(updatedRows);
    calculateTotal();
  };

  const handleAddRow = () => {
    setRows([...rows, { description: "", amount: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    calculateTotal();
  };

  const calculateTotal = () => {
    const amountSum = rows.reduce((sum, row) => sum + row.amount, 0);
    setTotal(amountSum);
  };

  const handleSave = () => {
    const isValid = validateForm();
    if (isValid) {
      saveData();
    }
  };

  const validateForm = () => {
    let isValid = true;
    for (const row of rows) {
      if (row.description.trim() === "" || isNaN(row.amount)) {
        isValid = false;
        break;
      }
    }
    setIsFormValid(isValid);
    return isValid;
  };

  const saveData = () => {
    // Placeholder function for saving data
    console.log("Data saved successfully!");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Invoice App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {rows.map((row, index) => (
            <IonItem key={index}>
              <IonInput
                type="text"
                value={row.description}
                placeholder="Description"
                onIonChange={(e) =>
                  handleDescriptionChange(index, e.detail.value!)
                }
              ></IonInput>
              <IonInput
                type="number"
                value={row.amount.toString()}
                placeholder="Amount"
                onIonChange={(e) =>
                  handleAmountChange(index, parseFloat(e.detail.value!))
                }
              ></IonInput>
              <IonButton
                color="danger"
                fill="solid"
                shape="round"
                onClick={() => handleRemoveRow(index)}
              >
                Remove
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonButton
          expand="full"
          onClick={handleAddRow}
          fill="outline"
          shape="round"
          color="success"
        >
          Add Row
        </IonButton>
        <div className="ion-text-center ion-margin">
          Total: <strong>{total}</strong>
        </div>
        <IonButton
          expand="full"
          onClick={handleSave}
          fill="outline"
          shape="round"
          color="primary"
        >
          Save
        </IonButton>
        {!isFormValid && (
          <IonText color="danger" className="ion-text-center ion-margin">
            Please fill in all fields and ensure all amounts are numeric.
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default App;
