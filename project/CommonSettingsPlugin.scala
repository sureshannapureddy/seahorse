/**
 * Copyright (c) 2015, CodiLime Inc.
 */

import com.typesafe.sbt.packager.universal.UniversalPlugin.autoImport.Universal
import sbt.Keys._
import sbt._
import sbt.plugins.JvmPlugin

object CommonSettingsPlugin extends AutoPlugin {
  override def requires = JvmPlugin
  override def trigger = allRequirements

  lazy val OurIT = config("it") extend Test

  lazy val globalResources = file("globalresources").getAbsoluteFile

  override def globalSettings = Seq(
    scalaVersion := "2.11.8"
  )

  override def projectSettings = Seq(
    organization := "io.deepsense",
    scalacOptions := Seq(
      "-unchecked", "-deprecation", "-encoding", "utf8", "-feature",
      "-language:existentials", "-language:implicitConversions"
    ),
    javacOptions ++= Seq(
      "-source", "1.7",
      "-target", "1.7"
    ),
    resolvers ++= Dependencies.resolvers,
    crossPaths := false,
    unmanagedResourceDirectories in Compile += globalResources,
    unmanagedResourceDirectories in Runtime += globalResources,
    unmanagedResourceDirectories in Test += globalResources
  ) ++ ouritSettings ++ testSettings ++ Seq(
    test <<= test in Test
  )

  lazy val ouritSettings = inConfig(OurIT)(Defaults.testSettings) ++ inConfig(OurIT) {
    Seq(
      testOptions ++= Seq(
        // Show full stacktraces (F), Put results in target/test-reports
        Tests.Argument(TestFrameworks.ScalaTest, "-oF", "-u", "target/test-reports")
      ),
      javaOptions := Seq(s"-DlogFile=${name.value}"),
      fork := true,
      unmanagedClasspath += baseDirectory.value / "conf"
    )
  }

  lazy val testSettings = inConfig(Test) {
    Seq(
      testOptions := Seq(
        // Put results in target/test-reports
        Tests.Argument(
          TestFrameworks.ScalaTest,
          "-o",
          "-u", "target/test-reports"
        )
      ),
      fork := true,
      javaOptions := Seq(s"-DlogFile=${name.value}"),
      unmanagedClasspath += baseDirectory.value / "conf"
    )
  }

  override def projectConfigurations = OurIT +: super.projectConfigurations
}
