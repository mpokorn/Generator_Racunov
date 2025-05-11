import React, { useState } from "react";

const InvoiceForm = () => {
  const [form, setForm] = useState({
    invoice_number: "",
    issue_date: "",
    due_date: "",
    currency: "EUR",
    discount_percent: 0,
    shipping: 0,
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    reference: "",
    notes: "",
    payment_terms: "",
    issuer: {
      name: "",
      address: "",
      postal_code: "",
      city: "",
      country: "",
      email: "",
      phone: ""
    },
    receiver: {
      name: "",
      address: "",
      postal_code: "",
      city: "",
      country: "",
      email: "",
      phone: ""
    },
    items: [
      { description: "", quantity: 1, unit_price: 0, tax_rate: 0 }
    ]
  });
  const [step, setStep] = useState(1);
  const steps = [
    "Od & Za",
    "Podatki računa",
    "Postavke",
    "Podatki o plačilu",
    "Povzetek",
  ];

  const handleChange = (path, value) => {
    const keys = path.split(".");
    setForm(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys.at(-1)] = value;
      return updated;
    });
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unit_price: 0, tax_rate: 0 }]
    }));
  };

  const removeItem = (index) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate the total amount of the invoice
    const total = form.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    // Prepare the payload to be sent
    const payload = {
      ...form,
      total, // Include the calculated total
    };

    try {
      // Send the invoice data to the server
      const res = await fetch("/v1/invoices/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Parse the server's response as JSON
      const data = await res.json();
      console.log(data); // Log the response data
      // Handle success (e.g., show a success message, redirect, etc.)
      if (res.ok) {
        alert("Račun uspešno ustvarjen!");
      
        // Odpri PDF v novem zavihku
        window.open(`/invoice/${data.id}/pdf`, "_blank");
      
        // Če želiš preusmeritev namesto novega zavihka:
        // window.location.href = `/invoice/${data.id}/pdf`;
      } else {
        alert("Računa ni mogoče ustvariti. Preverite konzolo za napake.");
      }

    } catch (error) {
      console.error("Napaka pri pošiljanju računa:", error);
      alert("Prišlo je do napake. Prosimo, preverite konzolo in poskusite znova.");

    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-200">Izdajatelj računa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(form.issuer).map(key => {
                let translatedKey = key.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                if (translatedKey === "Name") {
                  translatedKey = "Ime";
                } else if (translatedKey === "Address") {
                  translatedKey = "Naslov";
                } else if (translatedKey === "Postal Code") {
                  translatedKey = "Poštna številka";
                } else if (translatedKey === "City") {
                  translatedKey = "Mesto";
                } else if (translatedKey === "Country") {
                  translatedKey = "Država";
                } else if (translatedKey === "Email") {
                  translatedKey = "E-pošta";
                } else if (translatedKey === "Phone") {
                  translatedKey = "Telefon";
                }
                if (key !== "tax_number" && key !== "registration_number") { // Exclude tax_number and registration_number
                  return (
                    <div key={key} className="flex flex-col">
                      <label htmlFor={`issuer-${key}`} className="text-sm font-medium text-gray-400">{translatedKey}</label>
                      <input
                        id={`issuer-${key}`}
                        className="mt-1 p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={translatedKey}
                        value={form.issuer[key]}
                        onChange={e => handleChange(`issuer.${key}`, e.target.value)}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <h2 className="text-2xl font-semibold mt-8 text-gray-200">Prejemnik računa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(form.receiver).map(key => {
                let translatedKey = key.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                if (translatedKey === "Name") {
                  translatedKey = "Ime";
                } else if (translatedKey === "Address") {
                  translatedKey = "Naslov";
                } else if (translatedKey === "Postal Code") {
                  translatedKey = "Poštna številka";
                } else if (translatedKey === "City") {
                  translatedKey = "Mesto";
                } else if (translatedKey === "Country") {
                  translatedKey = "Država";
                } else if (translatedKey === "Email") {
                  translatedKey = "E-pošta";
                } else if (translatedKey === "Phone") {
                  translatedKey = "Telefon";
                }
                if (key !== "tax_number" && key !== "registration_number") {  // Exclude tax_number and registration_number
                  return (
                    <div key={key} className="flex flex-col">
                      <label htmlFor={`receiver-${key}`} className="text-sm font-medium text-gray-400">{translatedKey}</label>
                      <input
                        id={`receiver-${key}`}
                        className="mt-1 p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={translatedKey}
                        value={form.receiver[key]}
                        onChange={e => handleChange(`receiver.${key}`, e.target.value)}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">Podatki o Računu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="invoice_number" className="text-sm font-medium text-gray-400">Številka računa</label>
                <input
                  id="invoice_number"
                  className="input mt-1"
                  placeholder="Številka računa"
                  value={form.invoice_number}
                  onChange={e => handleChange("invoice_number", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="issue_date" className="text-sm font-medium text-gray-400">Datum izdaje</label>
                <input
                  id="issue_date"
                  className="input mt-1"
                  type="date"
                  value={form.issue_date}
                  onChange={e => handleChange("issue_date", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="due_date" className="text-sm font-medium text-gray-400">Rok plačila</label>
                <input
                  id="due_date"
                  className="input mt-1"
                  type="date"
                  value={form.due_date}
                  onChange={e => handleChange("due_date", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="currency" className="text-sm font-medium text-gray-400">Valuta</label>
                <select
                  id="currency"
                  className="input mt-1"
                  value={form.currency}
                  onChange={e => handleChange("currency", e.target.value)}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="discount_percent" className="text-sm font-medium text-gray-400">Popust %</label>
                <input
                  id="discount_percent"
                  className="input mt-1"
                  placeholder="Popust %"
                  type="number"
                  value={form.discount_percent}
                  onChange={e => handleChange("discount_percent", parseFloat(e.target.value))}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="shipping" className="text-sm font-medium text-gray-400">Poštnina (€)</label>
                <input
                  id="shipping"
                  className="input mt-1"
                  placeholder="Poštnina (€)"
                  type="number"
                  value={form.shipping}
                  onChange={e => handleChange("shipping", parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">Postavke</h2>
            {form.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-start">
                <div className="flex flex-col">
                  <label htmlFor={`description-${index}`} className="text-sm font-medium text-gray-400">Opis</label>
                  <input
                    id={`description-${index}`}
                    className="input mt-2"
                    placeholder="Opis"
                    value={item.description}
                    onChange={e => {
                      const items = [...form.items];
                      items[index].description = e.target.value;
                      handleChange("items", items);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`quantity-${index}`} className="text-sm font-medium text-gray-400">Količina</label>
                  <input
                    id={`quantity-${index}`}
                    className="input mt-2"
                    placeholder="Količina"
                    type="number"
                    value={item.quantity}
                    onChange={e => {
                      const items = [...form.items];
                      items[index].quantity = parseFloat(e.target.value);
                      handleChange("items", items);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`unit_price-${index}`} className="text-sm font-medium text-gray-400">Cena na enoto</label>
                  <input
                    id={`unit_price-${index}`}
                    className="input mt-2"
                    placeholder="Cena na enoto"
                    type="number"
                    value={item.unit_price}
                    onChange={e => {
                      const items = [...form.items];
                      items[index].unit_price = parseFloat(e.target.value);
                      handleChange("items", items);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`tax_rate-${index}`} className="text-sm font-medium text-gray-400">Davčna stopnja</label>
                  <input
                    id={`tax_rate-${index}`}
                    className="input mt-2"
                    placeholder="Davčna stopnja"
                    type="number"
                    value={item.tax_rate}
                    onChange={e => {
                      const items = [...form.items];
                      items[index].tax_rate = parseFloat(e.target.value);
                      handleChange("items", items);
                    }}
                  />
                </div>
                <button type="button" onClick={() => removeItem(index)} className="text-red-500 mt-2 self-end">
                  🗑️ Odstrani
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="btn">
              ➕ Dodaj postavko
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">Podatki o plačilu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="bank_name" className="text-sm font-medium text-gray-400">Ime banke</label>
                <input
                  id="bank_name"
                  className="input mt-1"
                  placeholder="Ime banke"
                  value={form.bank_name}
                  onChange={e => handleChange("bank_name", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="bank_account_name" className="text-sm font-medium text-gray-400">Ime računa</label>
                <input
                  id="bank_account_name"
                  className="input mt-1"
                  placeholder="Ime računa"
                  value={form.bank_account_name}
                  onChange={e => handleChange("bank_account_name", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="bank_account_number" className="text-sm font-medium text-gray-400">Številka računa</label>
                <input
                  id="bank_account_number"
                  className="input mt-1"
                  placeholder="Številka računa"
                  value={form.bank_account_number}
                  onChange={e => handleChange("bank_account_number", e.target.value)}
                />
              </div>
              <div className="flex flex-col col-span-full sm:col-span-1">
                <label htmlFor="reference" className="text-sm font-medium text-gray-400">Referenca</label>
                <input
                  id="reference"
                  className="input mt-1"
                  placeholder="Referenca"
                  value={form.reference}
                  onChange={e => handleChange("reference", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">Povzetek</h2>
            <p className="text-gray-300">Številka računa: <span className="text-white">{form.invoice_number}</span></p>
            <p className="text-gray-300">Datum izdaje: <span className="text-white">{form.issue_date}</span></p>
            <p className="text-gray-300">Datum zapadlosti: <span className="text-white">{form.due_date}</span></p>
            <p className="text-gray-300">Valuta: <span className="text-white">{form.currency}</span></p>
            <p className="text-gray-300">Popust: <span className="text-white">{form.discount_percent}%</span></p>
            <p className="text-gray-300">Poštnina: <span className="text-white">{form.shipping} €</span></p>
            <p className="text-gray-300">Ime banke: <span className="text-white">{form.bank_name}</span></p>
            <p className="text-gray-300">Ime računa banke: <span className="text-white">{form.bank_account_name}</span></p>
            <p className="text-gray-300">Številka računa banke: <span className="text-white">{form.bank_account_number}</span></p>
            <p className="text-gray-300">Referenca: <span className="text-white">{form.reference}</span></p>
            <p className="text-gray-300">Opombe: <span className="text-white">{form.notes}</span></p>
            <p className="text-gray-300">Plačilni pogoji: <span className="text-white">{form.payment_terms}</span></p>
            <h3 className="text-lg font-semibold text-gray-200">Izdajatelj:</h3>
            <p className="text-gray-300">Ime: <span className="text-white">{form.issuer.name}</span></p>
            <p className="text-gray-300">Naslov: <span className="text-white">{form.issuer.address}</span></p>
            <p className="text-gray-300">Poštna številka: <span className="text-white">{form.issuer.postal_code}</span></p>
            <p className="text-gray-300">Mesto: <span className="text-white">{form.issuer.city}</span></p>
            <p className="text-gray-300">Država: <span className="text-white">{form.issuer.country}</span></p>
            <p className="text-gray-300">Email: <span className="text-white">{form.issuer.email}</span></p>
            <p className="text-gray-300">Telefon: <span className="text-white">{form.issuer.phone}</span></p>

            <h3 className="text-lg font-semibold text-gray-200">Prejemnik:</h3>
            <p className="text-gray-300">Ime: <span className="text-white">{form.receiver.name}</span></p>
            <p className="text-gray-300">Naslov: <span className="text-white">{form.receiver.address}</span></p>
            <p className="text-gray-300">Poštna številka: <span className="text-white">{form.receiver.postal_code}</span></p>
            <p className="text-gray-300">Mesto: <span className="text-white">{form.receiver.city}</span></p>
            <p className="text-gray-300">Država: <span className="text-white">{form.receiver.country}</span></p>
            <p className="text-gray-300">Email: <span className="text-white">{form.receiver.email}</span></p>
            <p className="text-gray-300">Telefon: <span className="text-white">{form.receiver.phone}</span></p>

            <h3 className="text-lg font-semibold text-gray-200">Postavke:</h3>
            {form.items.map((item, index) => (
              <div key={index} className="text-gray-300">
                <p>Opis: <span className="text-white">{item.description}</span></p>
                <p>Količina: <span className="text-white">{item.quantity}</span></p>
                <p>Cena na enoto: <span className="text-white">{item.unit_price}</span></p>
                <p>Davčna stopnja: <span className="text-white">{item.tax_rate}</span></p>
              </div>
            ))}
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Ustvari Račun</h1>
      <div className="flex justify-between mb-8">
        {steps.map((label, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer ${
              index + 1 === step
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 transition duration-300"
            }`}
            onClick={() => setStep(index + 1)}
          >
            {label}
          </div>
        ))}
      </div>
      {renderStep()}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(Math.max(1, step - 1))}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
        >
          Nazaj
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
          >
            Naprej
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
          >
            ✅ Pošlji Račun
          </button>
        )}
      </div>
    </form>
  );
};

export default InvoiceForm;
