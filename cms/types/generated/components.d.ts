import type { Schema, Struct } from '@strapi/strapi';

export interface ResumeEducation extends Struct.ComponentSchema {
  collectionName: 'components_resume_educations';
  info: {
    description: 'Education entry';
    displayName: 'Education';
  };
  attributes: {
    degree: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.Date;
    field: Schema.Attribute.String & Schema.Attribute.Required;
    institution: Schema.Attribute.String & Schema.Attribute.Required;
    startDate: Schema.Attribute.Date;
  };
}

export interface ResumeExperience extends Struct.ComponentSchema {
  collectionName: 'components_resume_experiences';
  info: {
    description: 'Work experience entry';
    displayName: 'Experience';
  };
  attributes: {
    achievements: Schema.Attribute.JSON;
    company: Schema.Attribute.String & Schema.Attribute.Required;
    current: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.Date;
    position: Schema.Attribute.String & Schema.Attribute.Required;
    startDate: Schema.Attribute.Date & Schema.Attribute.Required;
  };
}

export interface ResumeSkill extends Struct.ComponentSchema {
  collectionName: 'components_resume_skills';
  info: {
    description: 'Skill entry';
    displayName: 'Skill';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['Software', 'Hardware', 'Building Systems', 'Audio']
    > &
      Schema.Attribute.Required;
    level: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'resume.education': ResumeEducation;
      'resume.experience': ResumeExperience;
      'resume.skill': ResumeSkill;
    }
  }
}
