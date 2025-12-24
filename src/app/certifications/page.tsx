"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { certificates } from "@/lib/mockData";
import { Certificate } from "@/types";

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Our Certifications</h1>
          <p className="text-xl text-text-muted">
            Quality and safety backed by international standards and rigorous testing protocols
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              hover
              className="p-6 cursor-pointer"
              onClick={() => setSelectedCert(cert)}
            >
              <div className="relative h-48 bg-background rounded-lg mb-4 overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">{cert.shortName}</h3>
              <h4 className="text-lg font-semibold text-text-primary mb-3">{cert.name}</h4>
              <p className="text-sm text-text-muted mb-4">{cert.description}</p>
              <div className="text-sm text-text-muted">
                <p>Issued by: {cert.issuedBy}</p>
                <p>Valid until: {new Date(cert.validUntil).toLocaleDateString()}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Our Commitment to Quality
          </h2>
          <div className="prose max-w-none text-text-muted space-y-4">
            <p>
              At NOIR VITA, quality assurance is the foundation of everything we do. Our manufacturing
              facilities and processes meet the highest international standards, ensuring that every
              product delivers consistent quality and safety.
            </p>
            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Quality Control Measures
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Raw material testing and verification</li>
              <li>In-process quality monitoring</li>
              <li>Finished product testing</li>
              <li>Third-party laboratory verification</li>
              <li>Heavy metal and contaminant screening</li>
              <li>Microbiological safety testing</li>
            </ul>
            <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
              Manufacturing Standards
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>Climate-controlled facilities</li>
              <li>Contamination prevention protocols</li>
              <li>Equipment calibration and maintenance</li>
              <li>Personnel training and qualification</li>
              <li>Batch tracking and documentation</li>
              <li>Regular facility audits</li>
            </ul>
          </div>
        </Card>

        <div className="mt-12 p-6 bg-surface/50 border border-text-muted/10 rounded-lg text-center">
          <p className="text-sm text-text-muted">
            <strong className="text-text-primary">Important Notice:</strong> The certifications
            displayed on this page are for demonstration purposes only as part of this UI prototype.
            This is not a real supplement company. Always verify certification authenticity when
            purchasing real health products.
          </p>
        </div>
      </div>

      <Modal
        isOpen={selectedCert !== null}
        onClose={() => setSelectedCert(null)}
        title={selectedCert?.name || ""}
        size="lg"
      >
        {selectedCert && (
          <div className="space-y-6">
            <div className="relative h-96 bg-background rounded-lg overflow-hidden">
              <Image
                src={selectedCert.image}
                alt={selectedCert.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                {selectedCert.shortName}
              </h3>
              <p className="text-text-muted mb-4">{selectedCert.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Issued By</p>
                  <p className="font-semibold text-text-primary">{selectedCert.issuedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Valid Until</p>
                  <p className="font-semibold text-text-primary">
                    {new Date(selectedCert.validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
