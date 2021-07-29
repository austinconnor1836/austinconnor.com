import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  styled,
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "1rem",
      backgroundColor: theme.palette.primary.dark,
      width: "100%",
      height: "80vh",
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);

const StyledStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const educationTitle = "B.A. in Physics, Aug. 2018";
const collegeText = "University of Nebraska at Lincoln";

function getSteps() {
  return [
    {
      businessName: "Allo Communications, Jan. 2020 - Present",
      jobTitle: "Software Engineer",
    },
    {
      businessName: "Assurity Life Insurance, Sep. 2019 - Dec. 2019",
      jobTitle: "Software Development Specialist",
    },
    {
      businessName: "TD Ameritrade, May 2019 - Aug. 2019",
      jobTitle: "Software Engineering Intern",
    },
    {
      businessName: "Firespring, Jan. 2019 - May 2019",
      jobTitle: "Software Engineering Intern",
    },
    {
      businessName: "PenLink, May 2018 - Aug. 2018",
      jobTitle: "Software Engineering Intern",
    },
    {
      businessName: "Nebraska Book Company, Jan. 2018 - May 2018",
      jobTitle: "Software Engineering Intern",
    },
  ];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return (
        <>
          <Typography variant="body2">
            <strong>Methodologies</strong>: Agile and Kanban
          </Typography>
          <Typography variant="body2">
            Built applications using TypeScript, React, GraphQL, Go, Python,
            dynamoDB, AWS Lambda, and many other AWS utilities.
          </Typography>
          <Typography variant="body2">
            Used libraries such as{" "}
            <a
              href="https://react-query.tanstack.com/"
              target="_blank"
              rel="noreferrer"
            >
              react-query
            </a>{" "}
            to query API endpoints using GraphQL, AWS Lambda, and DynamboDb.
          </Typography>
          <Typography variant="body2">
            Used AWS lambda and DynamoDb to build serverless endpoints for the
            frontend to query.
          </Typography>
        </>
      );
    case 1:
      return (
        <>
          <Typography variant="body2">
            <strong>Methodologies</strong>: Agile
          </Typography>
          <Typography variant="body2">
            Processed sales data using Python, SQL, C#, and Powershell.
          </Typography>
          <Typography variant="body2">
            Built Python scripts to organize bulk SQL statements so that higher
            throughput could be achieved.
          </Typography>
        </>
      );
    case 2:
      return (
        <>
          <Typography variant="body2">
            <strong>Methodologies</strong>: Agile
          </Typography>
          <Typography variant="body2">
            Transitioned legacy applications using React, GraphQL, Java-Spring,
            PCF, and agile methodologies.
          </Typography>
          <Typography variant="body2">
            Constructed API using Java Spring, Querydsl, React, and GraphQL to
            display internal operational data.
          </Typography>
        </>
      );
    case 3:
      return (
        <>
          <Typography variant="body2">
            Maintained sites for St. Baldrick's cancer research using Ruby on
            Rails, React, AWS, PHP, and agile methodologies.
          </Typography>
        </>
      );
    case 4:
      return (
        <>
          <Typography variant="body2">
            Constructed in-house website using .NET Core, C#, React, agile
            methodologies, and Microsoft TCF.
          </Typography>
        </>
      );
    case 5:
      return (
        <>
          <Typography variant="body2">
            Built centralized inventory application using .NET, Azure, SQL, C#,
            and agile methodologies.
          </Typography>
        </>
      );
    default:
      return (
        <>
          <Typography variant="body2">Unknown step</Typography>
        </>
      );
  }
}

const Resume = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <StyledTypography variant="h2">
        <u>Experience</u>
      </StyledTypography>
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => {
          return (
            <Step key={label.businessName}>
              <StepLabel optional={<Typography>{label.jobTitle}</Typography>}>
                {label.businessName}
              </StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          );
        })}
      </StyledStepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
      <StyledTypography variant="h2">
        <u>Education</u>
      </StyledTypography>
      <StyledStepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel optional={<Typography>{educationTitle}</Typography>}>
            {collegeText}
          </StepLabel>
        </Step>
      </StyledStepper>
    </div>
  );
};

export default Resume;
