import { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';
(window as any).global = window;

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const response = await Storage.list('invoices/');
      let files: (string | undefined)[]=[];
      response.results.forEach((res) =>{
        files.push(res.key);
      } )
      const invoiceIds = files.map((item) => item.replace('invoices/', ''));
      setInvoices(invoiceIds);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await Storage.remove(`invoices/${invoiceId}`);
      loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Invoice List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <p>Loading...</p>
        ) : invoices.length === 0 ? (
          <p>Nothing to see here</p>
        ) : (
          <IonList>
            {invoices.map((invoiceId) => (
              <IonItem key={invoiceId}>
                <IonLabel>Invoice ID: {invoiceId}</IonLabel>
                <IonButton
                  fill="outline"
                  slot="end"
                  color="danger"
                  onClick={() => handleDeleteInvoice(invoiceId)}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default InvoiceList;
