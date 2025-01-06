import TemplatePreview from '@/app/shared/email-templates/template-preview';

export default function EmailTemplates() {
  return (
    <div className="mt-10 grid grid-cols-1 place-content-center gap-6 @container lg:grid-cols-2 lg:gap-8">
      <TemplatePreview title="Account Email" />
      <TemplatePreview title="Order Email" />
    </div>
  );
}
