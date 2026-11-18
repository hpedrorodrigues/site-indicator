import { type CSSProperties, useEffect, useState } from 'react';
import {
  Col,
  ColorPicker,
  Form,
  type FormInstance,
  type FormRule,
  Input,
  Row,
  Select,
  Typography,
  Alert,
} from 'antd';
import { Color } from '@rc-component/color-picker';
import {
  MatchRule,
  Placement,
  Shape,
  type Site,
  isValidValue,
  normalizeValue,
} from '../../persistence';
import {
  Labels,
  MatchRuleDescriptions,
  MatchRules,
  Placements,
  Shapes,
  ValueErrors,
} from '../../labels';

const { Title } = Typography;

export const INITIAL_SITE: Site = {
  label: '',
  value: '',
  color: '#179aeb',
  labelColor: '#F1F1F1',
  shape: Shape.Ribbon,
  matchRule: MatchRule.Exact,
  placement: Placement.TopLeft,
};

export const cloneSite = (site: Site): Site => ({
  ...site,
  id: undefined,
  label: Labels.Site.CopyLabel(site.label),
});

export const submitForm = (form: FormInstance, onPostSubmit?: () => void) =>
  form
    .validateFields()
    .then(() => {
      form.submit();
      onPostSubmit?.();
    })
    .catch(() => undefined);

function createOptions<T extends string>(record: Record<T, string>) {
  return Object.keys(record).map((key) => ({
    label: record[key as T],
    value: key,
  }));
}

const REQUIRED_FIELD_RULE: FormRule = {
  message: 'This field is required.',
  required: true,
};

const colorPickerStyle: CSSProperties = {
  width: '100%',
};

type SiteFormProps = {
  onSubmit?: (_: Site) => void;
  form?: FormInstance<Site>;
  initialSite?: Site;
};

const SiteForm = ({ onSubmit, form, initialSite }: SiteFormProps) => {
  const [matchRule, setMatchRule] = useState<MatchRule>(
    initialSite?.matchRule ?? INITIAL_SITE.matchRule
  );

  useEffect(() => {
    if (initialSite) {
      form?.setFieldsValue(initialSite);
    }
  }, [form, initialSite]);

  return (
    <Form<Site>
      form={form}
      onFinish={(site) =>
        onSubmit?.({
          ...initialSite,
          ...site,
          value: normalizeValue(site.matchRule, site.value),
          titlePrefix: site.titlePrefix?.trim() || undefined,
        })
      }
      layout="vertical"
      id="siteForm"
      initialValues={initialSite}
    >
      <Form.Item
        name="label"
        label={Labels.Site.Field.Label}
        rules={[REQUIRED_FIELD_RULE]}
      >
        <Input maxLength={30} />
      </Form.Item>
      <Row gutter={42} align="middle">
        <Col flex="250px">
          <Form.Item
            name="matchRule"
            label={Labels.Site.Field.MatchRule}
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Select
              options={createOptions(MatchRules)}
              onSelect={(value) => setMatchRule(value)}
            />
          </Form.Item>
        </Col>
        <Col flex="350px">
          <Form.Item
            name="value"
            label={Labels.Site.Field.Value}
            dependencies={['matchRule']}
            rules={[
              REQUIRED_FIELD_RULE,
              ({ getFieldValue }) => ({
                validator: (_, value: string) => {
                  const rule: MatchRule = getFieldValue('matchRule');
                  return isValidValue(rule, value ?? '')
                    ? Promise.resolve()
                    : Promise.reject(new Error(ValueErrors[rule]));
                },
              }),
            ]}
          >
            <Input maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={42} align="middle">
        <Col flex="auto">
          <Alert
            type="info"
            showIcon
            title={MatchRuleDescriptions[matchRule]}
          />
        </Col>
      </Row>
      <Title level={5}>{Labels.Form.SectionTitle}</Title>
      <Row gutter={42} align="middle">
        <Col flex="300px">
          <Form.Item
            name="shape"
            label={Labels.Site.Field.Shape}
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Select options={createOptions(Shapes)} />
          </Form.Item>
        </Col>
        <Col flex="300px">
          <Form.Item
            name="placement"
            label={Labels.Site.Field.Placement}
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Select options={createOptions(Placements)} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={42} align="middle">
        <Col flex="300px">
          <Form.Item
            name="color"
            label={Labels.Site.Field.Color}
            rules={[REQUIRED_FIELD_RULE]}
            valuePropName="value"
            normalize={(color: Color) => color.toHexString()}
          >
            <ColorPicker showText style={colorPickerStyle} disabledAlpha />
          </Form.Item>
        </Col>
        <Col flex="300px">
          <Form.Item
            name="labelColor"
            label={Labels.Site.Field.LabelColor}
            rules={[REQUIRED_FIELD_RULE]}
            valuePropName="value"
            normalize={(color: Color) => color.toHexString()}
          >
            <ColorPicker showText style={colorPickerStyle} disabledAlpha />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={42} align="middle">
        <Col flex="300px">
          <Form.Item
            name="titlePrefix"
            label={Labels.Site.Field.TitlePrefix}
            tooltip={Labels.Site.TitlePrefix.Description}
          >
            <Input
              maxLength={12}
              placeholder={Labels.Site.TitlePrefix.Placeholder}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SiteForm;
