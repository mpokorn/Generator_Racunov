import React, { useState } from "react";

const emptyParty = {
  name: "",
  address: "",
  postal_code: "",
  city: "",
  country: "",
  email: "",
  phone: "",
};

const emptyItem = {
  description: "",
  quantity: 1,
  unit_price: 0,
  tax_rate: 0,
};

export default function InvoicePreview() {
  const [invoice, setInvoice] = useState({
    invoice_number: "",
    customer_name: "",
    total: 0,
    items: [emptyItem],
    issuer: { ...emptyParty },
    receiver: { ...emptyParty },
    issue_date: "",
    due_date: "",
    currency: "EUR",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    reference: "",
    notes: "",
    payment_terms: "",
    discount_percent: 0,
    shipping: 0,
  });

  const handleChange = (section, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = invoice.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setInvoice({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    setInvoice({ ...invoice, items: [...invoice.items, emptyItem] });
  };

  const removeItem = (index) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const submitInvoiceAsHTML = async () => {
    try {
      console.log("URL za fetch:", `${process.env.REACT_APP_API_URL}/invoices`);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) throw new Error("Napaka pri pošiljanju računa");

      const data = await response.json();

      if (data.id) {
        // Odpri HTML pogled računa
        const htmlUrl = `${process.env.REACT_APP_API_URL}/invoices/${data.id}/html`;
        window.open(htmlUrl, "_blank");
      } else {
        alert("Račun shranjen, ampak HTML ni na voljo (ni ID-ja)");
      }
    } catch (error) {
      console.error(error);
      alert("Napaka pri ustvarjanju HTML računa");
    }
  };




  const submitInvoiceAsPDF = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) throw new Error("Napaka pri ustvarjanju PDF računa");

      const data = await response.json();

      if (data.id) {
        const pdfUrl = `${process.env.REACT_APP_API_URL}/invoices/${data.id}/pdf`;
        window.open(pdfUrl, "_blank");
      } else {
        alert("Račun shranjen, vendar ni možno odpreti PDF-ja (ni ID-ja)");
      }
    } catch (error) {
      console.error(error);
      alert("Napaka pri ustvarjanju PDF računa");
    }
  };



  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-8">
      <h2 className="text-2xl font-bold mb-4">Generator računov</h2>

      {/* 1. OD & ZA */}
      <section>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Izdajatelj računa</h4>
            {Object.entries(invoice.issuer).map(([field, value]) => (
              <input
                key={field}
                type="text"
                placeholder={translatePartyField(field)}
                value={value}
                onChange={(e) => handleChange("issuer", field, e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Prejemnik računa</h4>
            {Object.entries(invoice.receiver).map(([field, value]) => (
              <input
                key={field}
                type="text"
                placeholder={translatePartyField(field)}
                value={value}
                onChange={(e) => handleChange("receiver", field, e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Podatki računa */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Podatki računa</h3>
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">Številka računa</label>
            <input
              type="text"
              placeholder="Številka računa"
              value={invoice.invoice_number}
              onChange={(e) => setInvoice({ ...invoice, invoice_number: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valuta</label>
            <select
              value={invoice.currency}
              onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="CHF">Swiss Franc</option>
              <option value="JPY">Japanese Yen (¥)</option>
              <option value="AUD">Australian Dollar</option>
              <option value="CAD">Canadian Dollar</option>
              <option value="CNY">Chinese Yuan (元)</option>
              <option value="SEK">Swedish Krona</option>
              <option value="NZD">New Zealand Dollar</option>
              <option value="NOK">Norwegian Krone</option>
              <option value="DKK">Danish Krone</option>
              <option value="HKD">Hong Kong Dollar</option>
              <option value="SGD">Singapore Dollar</option>
              <option value="MXN">Mexican Peso</option>
              <option value="ZAR">South African Rand</option>
              <option value="INR">Indian Rupee</option>
              <option value="BRL">Brazilian Real</option>
              <option value="RUB">Russian Ruble</option>
              <option value="TRY">Turkish Lira</option>
              <option value="PLN">Polish Zloty</option>
              <option value="THB">Thai Baht</option>
              <option value="MYR">Malaysian Ringgit</option>
              <option value="PHP">Philippine Peso</option>
              <option value="IDR">Indonesian Rupiah</option>
              <option value="AED">United Arab Emirates Dirham</option>
              <option value="SAR">Saudi Riyal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Datum izdaje</label>
            <input
              type="date"
              value={invoice.issue_date}
              onChange={(e) => setInvoice({ ...invoice, issue_date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rok plačila</label>
            <input
              type="date"
              value={invoice.due_date}
              onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

        </div>
      </section>

      {/* Bančni podatki */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Bančni podatki</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Ime banke</label>
            <input
              type="text"
              value={invoice.bank_name}
              onChange={(e) => setInvoice({ ...invoice, bank_name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Npr. NLB d.d."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ime imetnika računa</label>
            <input
              type="text"
              value={invoice.bank_account_name}
              onChange={(e) =>
                setInvoice({ ...invoice, bank_account_name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Npr. Janez Novak"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Številka bančnega računa</label>
            <input
              type="text"
              value={invoice.bank_account_number}
              onChange={(e) =>
                setInvoice({ ...invoice, bank_account_number: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="SI56 0201 1025 1234 567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Referenca</label>
          <input
            type="text"
            value={invoice.reference}
            onChange={(e) => setInvoice({ ...invoice, reference: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Sklic/reference (npr. SI00-2025-001)"
          />
        </div>
      </section>




      {/* Artikli */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Artikli</h3>
        <div className="grid grid-cols-5 gap-2 mb-2 font-semibold text-sm text-gray-600">
          <span>Opis</span>
          <span>Količina</span>
          <span>Cena/enota (€)</span>
          <span>DDV (%)</span>
          <span></span>
        </div>
        {invoice.items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-3 items-center">
            <input
              type="text"
              placeholder="Opis artikla"
              value={item.description}
              onChange={(e) => handleItemChange(index, "description", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="Količina"
              value={item.quantity || ""}
              onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="Cena na enoto (€)"
              value={item.unit_price || ""}
              onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="DDV (%)"
              value={item.tax_rate || ""}
              onChange={(e) => handleItemChange(index, "tax_rate", parseFloat(e.target.value) || 0)}
              className="p-2 border rounded"
            />
            <button
              onClick={() => removeItem(index)}
              className="text-red-600 hover:underline"
            >
              Odstrani
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Dodaj artikel
        </button>
      </section>



      {/* Povzetek / Dodatno */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Dodatno</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Popust */}
          <div>
            <label className="block text-sm font-medium mb-1">Popust (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={invoice.discount_percent || ""}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    discount_percent: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Popust na celoten znesek"
              />
              <input
                type="checkbox"
                checked={invoice.include_discount ?? false}
                onChange={(e) =>
                  setInvoice({ ...invoice, include_discount: e.target.checked })
                }
                className="accent-blue-600 h-5 w-5 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Poštnina */}
          <div>
            <label className="block text-sm font-medium mb-1">Poštnina (€)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={invoice.shipping || ""}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    shipping: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Stroški dostave"
              />
              <input
                type="checkbox"
                checked={invoice.include_shipping ?? false}
                onChange={(e) =>
                  setInvoice({ ...invoice, include_shipping: e.target.checked })
                }
                className="accent-blue-600 h-5 w-5 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* OPOMBE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Dodatne opombe</label>
          <textarea
            placeholder="Poljubne informacije za prejemnika"
            value={invoice.notes}
            onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        {/* POGOJI */}
        <div>
          <label className="block text-sm font-medium mb-1">Plačilni pogoji</label>
          <textarea
            placeholder="Npr. plačilo v 15 dneh, zamudne obresti ..."
            value={invoice.payment_terms}
            onChange={(e) => setInvoice({ ...invoice, payment_terms: e.target.value })}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Skupni znesek</h3>
        <div className="space-y-2 text-right text-sm">

          {/* Neto znesek */}
          <p>
            <span className="font-medium">Znesek (brez DDV):</span>{" "}
            {invoice.items
              .reduce((sum, item) => {
                const rate = typeof item.tax_rate === "number" ? item.tax_rate : 0;
                const net = item.unit_price / (1 + rate / 100);
                return sum + net * item.quantity;
              }, 0)
              .toFixed(2)}{" "}
            {invoice.currency}
          </p>

          {/* Skupni DDV */}
          <p>
            <span className="font-medium">DDV:</span>{" "}
            {invoice.items
              .reduce((sum, item) => {
                const rate = typeof item.tax_rate === "number" ? item.tax_rate : 0;
                const net = item.unit_price / (1 + rate / 100);
                const tax = item.unit_price - net;
                return sum + tax * item.quantity;
              }, 0)
              .toFixed(2)}{" "}
            {invoice.currency}
          </p>

          {/* Poštnina */}
          <p>
            <span className="font-medium">Poštnina:</span>{" "}
            {invoice.include_shipping ? invoice.shipping.toFixed(2) : "0.00"}{" "}
            {invoice.currency}
          </p>

          {/* Popust */}
          <p>
            <span className="font-medium">Popust:</span>{" "}
            {invoice.include_discount
              ? `- ${(
                (invoice.items.reduce(
                  (sum, item) => sum + item.unit_price * item.quantity,
                  0
                ) *
                  invoice.discount_percent) /
                100
              ).toFixed(2)}`
              : "0.00"}{" "}
            {invoice.currency}
          </p>

          <hr />

          {/* Skupna vsota */}
          <p className="text-lg font-semibold">
            Skupna vsota:{" "}
            {(() => {
              const base = invoice.items.reduce(
                (sum, item) => sum + item.unit_price * item.quantity,
                0
              );
              const shipping = invoice.include_shipping ? invoice.shipping : 0;
              const discount = invoice.include_discount
                ? (base * invoice.discount_percent) / 100
                : 0;
              const total = base + shipping - discount;
              return ` ${total.toFixed(2)} ${invoice.currency}`;
            })()}
          </p>
        </div>
      </section>


      {/* Gumb za oddajo */}
      <div className="text-right space-x-4">
        <button
          onClick={submitInvoiceAsHTML}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Ustvari račun (HTML)
        </button>

        <button
          onClick={submitInvoiceAsPDF}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Ustvari račun (PDF)
        </button>
      </div>
    </div>
  );
} // konec komponente

// Pomožna funkcija za prevode
function translatePartyField(field) {
  const map = {
    name: "Ime podjetja / osebe",
    address: "Naslov",
    postal_code: "Poštna številka",
    city: "Kraj",
    country: "Država",
    email: "E-pošta",
    phone: "Telefon",
  };
  return map[field] || field;
}