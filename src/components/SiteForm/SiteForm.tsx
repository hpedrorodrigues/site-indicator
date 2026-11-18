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
  Slider,
  Typography,
  Alert,
} from 'antd';
import { Color } from '@rc-component/color-picker';
import {
  DefaultOpacity,
  DefaultSize,
  DefaultTarget,
  MatchRule,
  MinOpacity,
  Placement,
  Shape,
  type Site,
  type ValueRule,
  getOpacity,
  getSize,
  getTarget,
  isValidValue,
  normalizeValue,
} from '../../persistence';
import {
  Labels,
  MatchRuleDescriptions,
  MatchRules,
  Placements,
  Shapes,
  Sizes,
  Targets,
  valueError,
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
  order: undefined,
  label: Labels.Site.CopyLabel(site.label),
});

const toFormValues = (site: Site): Site => ({
  ...site,
  target: getTarget(site),
  size: getSize(site),
  opacity: getOpacity(site),
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

const isCidrRule = (matchRule: MatchRule): boolean =>
  matchRule === MatchRule.CidrV4 || matchRule === MatchRule.CidrV6;

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
      form?.setFieldsValue(toFormValues(initialSite));
    }
  }, [form, initialSite]);

  return (
    <Form<Site>
      form={form}
      onFinish={(site) => {
        const target =
          isCidrRule(site.matchRule) || site.target === DefaultTarget
            ? undefined
            : site.target;
        onSubmit?.({
          ...initialSite,
          ...site,
          target,
          value: normalizeValue(
            { matchRule: site.matchRule, target },
            site.value
          ),
          titlePrefix: site.titlePrefix?.trim() || undefined,
          size: site.size === DefaultSize ? undefined : site.size,
          opacity: site.opacity === DefaultOpacity ? undefined : site.opacity,
        });
      }}
      layout="vertical"
      id="siteForm"
      initialValues={initialSite && toFormValues(initialSite)}
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
            dependencies={['matchRule', 'target']}
            rules={[
              REQUIRED_FIELD_RULE,
              ({ getFieldValue }) => ({
                validator: (_, value: string) => {
                  const rule: ValueRule = {
                    matchRule: getFieldValue('matchRule'),
                    target: getFieldValue('target'),
                  };
                  return isValidValue(rule, value ?? '')
                    ? Promise.resolve()
                    : Promise.reject(new Error(valueError(rule)));
                },
              }),
            ]}
          >
            <Input maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
      {!isCidrRule(matchRule) && (
        <Row gutter={42} align="middle">
          <Col flex="250px">
            <Form.Item
              name="target"
              label={Labels.Site.Field.Target}
              tooltip={Labels.Site.Target.Description}
              rules={[REQUIRED_FIELD_RULE]}
            >
              <Select options={createOptions(Targets)} />
            </Form.Item>
          </Col>
        </Row>
      )}
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
            name="size"
            label={Labels.Site.Field.Size}
            rules={[REQUIRED_FIELD_RULE]}
          >
            <Select options={createOptions(Sizes)} />
          </Form.Item>
        </Col>
        <Col flex="300px">
          <Form.Item
            name="opacity"
            label={Labels.Site.Field.Opacity}
            tooltip={Labels.Site.Opacity.Description}
          >
            <Slider
              min={MinOpacity}
              max={100}
              step={10}
              tooltip={{ formatter: (value) => `${value}%` }}
            />
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
